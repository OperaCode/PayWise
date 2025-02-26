const cron = require("node-cron");
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Wallet = require("../models/Wallet"); // Ensure you have the Wallet model

// Function to get user wallet
const getUserWallet = async (userId) => {
  return await Wallet.findOne({ user: userId });
};

// Ensure database connection is established before running cron jobs
mongoose.connection.once("open", () => {
  console.log("Connected to the database. Starting cron job for recurring payments.");

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // Find all active recurring payments that are due
      const recurringPayments = await Payment.find({
        status: "active",
        isRecurring: true,
        nextExecution: { $lte: now },
      });

      for (const payment of recurringPayments) {
        console.log(`Processing recurring payment: ${payment._id}`);

        // Validate payment amount
        if (payment.amount <= 0) {
          console.warn(`Invalid payment amount $${payment.amount} for payment ${payment._id}. Skipping.`);
          continue;
        }

        // Validate sender wallet balance
        const userWallet = await getUserWallet(payment.user);
        if (!userWallet) {
          console.warn(`Wallet not found for user ${payment.user}. Skipping payment.`);
          continue;
        }

        if (userWallet.balance < payment.amount) {
          console.warn(`Insufficient balance for user ${payment.user}. Skipping payment.`);
          continue;
        }

        // Deduct balance and save wallet
        userWallet.balance -= payment.amount;
        await userWallet.save();

        console.log(`Payment of $${payment.amount} from user ${payment.user} to biller ${payment.biller} completed.`);

        // Update next execution date
        let nextDate = new Date(payment.nextExecution);
        if (payment.frequency === "daily") nextDate.setDate(nextDate.getDate() + 1);
        else if (payment.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7);
        else if (payment.frequency === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);

        // Ensure next execution date is in the future
        if (nextDate <= now) {
          console.warn(`Next execution date for payment ${payment._id} is incorrect. Skipping update.`);
          continue;
        }

        // Update the next execution date in the original recurring payment
        payment.nextExecution = nextDate;
        await payment.save();
      }
    } catch (error) {
      console.error("Error processing recurring payments:", error);
    }
  });
});
