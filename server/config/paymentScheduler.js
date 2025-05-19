const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const Biller = require("../models/billerModel");

// Utility to get next recurring date
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

// Cron job runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  now.setSeconds(0, 0); // Normalize for precision
  console.log("🔄 Cron is running at", new Date().toISOString());

  try {
    const duePayments = await Payment.find({
      status: "Pending",
      scheduleDate: { $lte: now },
    });

    if (!duePayments.length) {
      console.log("📭 No due payments found.");
      return;
    }

    console.log(`📌 Found ${duePayments.length} due payment(s)`);

    for (const payment of duePayments) {
      const currentUser = await User.findById(payment.user);
      if (!currentUser) {
        console.log(`⚠️ User not found for Payment ${payment._id}`);
        continue;
      }

      // Check wallet balance
      if (currentUser.wallet.lockedAmount < payment.amount) {
        console.log(`⛔ Skipping Payment ${payment._id} — Insufficient funds`);
        continue;
      }

      // Deduct from locked amount
      currentUser.wallet.lockedAmount -= payment.amount;

      // Rewards calculation
      let reward = payment.amount > 100 ? 10 : parseFloat((payment.amount * 0.02).toFixed(2));
      const usdEquivalent = parseFloat((reward / 100).toFixed(2));

      currentUser.wallet.payCoins += reward;
      currentUser.wallet.rewardHistory.push({
        amount: reward,
        usdEquivalent,
        reason: `Scheduled payment of $${payment.amount}`,
      });

      try {
        await currentUser.save();
      } catch (error) {
        console.log(`❌ Error saving user wallet: ${error.message}`);
        continue;
      }

      // Mark current payment as successful
      payment.status = "Successful";
      payment.paidAt = new Date();

      // Recurring logic
      if (payment.isRecurring && payment.recurrence?.occurrencesLeft > 1) {
        const nextDate = getNextExecutionDate(payment.scheduleDate, payment.frequency);

        const updatedOccurrencesLeft = payment.recurrence.occurrencesLeft - 1;
        const lastPaidAt = new Date();

        const newRecurringPayment = {
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
            occurrencesLeft: updatedOccurrencesLeft,
            lastPaidAt,
          },
          description: payment.description,
          status: "Pending",
        };

        try {
          await Payment.create(newRecurringPayment);
          console.log(`🔁 Created next recurring payment for ${nextDate}`);
        } catch (err) {
          console.log(`❌ Error creating recurring payment: ${err.message}`);
        }

        // Save the current payment with updated recurrence
        payment.recurrence.occurrencesLeft = updatedOccurrencesLeft;
        payment.recurrence.lastPaidAt = lastPaidAt;
      }

      try {
        await payment.save();
      } catch (err) {
        console.log(`❌ Error saving payment ${payment._id}: ${err.message}`);
        continue;
      }

      // Update biller stats
      if (payment.recipientBiller) {
        try {
          const biller = await Biller.findById(payment.recipientBiller);
          if (biller) {
            await Biller.findByIdAndUpdate(biller._id, {
              $inc: { totalAmountPaid: Number(payment.amount) },
            });

            console.log(`🏦 Updated totalAmountPaid for Biller ${biller.nickname} by $${payment.amount}`);
          } else {
            console.log(`⚠️ Biller not found for ID: ${payment.recipientBiller}`);
          }
        } catch (err) {
          console.log(`❌ Error updating biller: ${err.message}`);
        }
      }

      console.log(`✅ AutoPaid $${payment.amount} | Reward: ${reward} PayCoins`);
    }
  } catch (error) {
    console.error("💥 Cron job error:", error);
  }
});
