const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const Biller = require("../models/billerModel");

const getNextExecutionDate = (currentDate, frequency) => {
  const next = new Date(currentDate);
  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    default:
      return null;
  }
  return next;
};

cron.schedule("* * * * *", async () => {
  const now = new Date();
  now.setSeconds(0, 0);
  console.log("Cron is running at", new Date().toISOString());

  try {
    const duePayments = await Payment.find({
      status: "Pending",
      scheduleDate: { $lte: now },
    });

    if (duePayments.length === 0) {
      console.log("No due payments found.");
      return;
    }

    console.log("Found", duePayments.length, "due payments");

    for (const payment of duePayments) {
      const user = await User.findById(payment.user);
      if (!user) {
        console.log(`User not found for Payment ${payment._id}`);
        continue;
      }

      if (user.wallet.lockedAmount < payment.amount) {
        console.log(`Skipping Payment ${payment._id} — Insufficient funds`);
        continue;
      }

      // Deduct amount
      user.wallet.lockedAmount -= payment.amount;

      // Rewards Logic
      let reward = 0;
      if (payment.amount > 100) {
        reward = 10;
      } else {
        reward = parseFloat((payment.amount * 0.02).toFixed(2));
      }

      user.wallet.payCoins += reward;
      const usdEquivalent = reward / 100;
      user.wallet.rewardHistory.push({
        amount: reward,
        usdEquivalent: usdEquivalent,
        reason: `Scheduled payment of $${payment.amount}`,
      });

      try {
        await user.save();
      } catch (error) {
        console.log(`Error updating wallet for User ${user._id}: ${error.message}`);
        continue;
      }

      // Mark payment as successful
      payment.status = "Successful";
      payment.paidAt = new Date();

      // Recurring?
      if (payment.isRecurring && payment.recurrence?.occurrencesLeft > 1) {
        payment.recurrence.occurrencesLeft -= 1;
        payment.recurrence.lastPaidAt = new Date();

        const nextDate = getNextExecutionDate(payment.scheduleDate, payment.frequency);
        await payment.save();

        await Payment.create({
          user: payment.user,
          recipientUser: payment.recipientUser,
          recipientBiller: payment.recipientBiller,
          amount: payment.amount,
          transactionRef: "TX-" + uuidv4(),
          isRecurring: true,
          frequency: payment.frequency,
          isAutoPayment: payment.isAutoPayment,
          scheduleDate: nextDate,
          nextExecution: nextDate,
          paymentType: payment.paymentType,
          recurrence: {
            occurrencesLeft: payment.recurrence.occurrencesLeft,
            lastPaidAt: payment.recurrence.lastPaidAt,
          },
          description: payment.description,
          status: "Pending",
        });

        console.log(`Created next recurring payment for ${nextDate}`);
      } else {
        await payment.save();
      }

      // Update biller if applicable
      const biller = await Biller.findById(payment.recipientBiller);
      if (biller) {
        biller.totalAmountPaid += Number(payment.amount);
        try {
          await biller.save();
          console.log(`Updated Biller ${biller.nickname}'s totalAmountPaid`);
        } catch (error) {
          console.log(`Error updating Biller ${biller.nickname}: ${error.message}`);
        }
      } else {
        console.log(`Biller not found for Payment ${payment._id}`);
      }

      console.log(`✅ AutoPaid $${payment.amount} | Reward: ${reward} PayCoins`);
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});
