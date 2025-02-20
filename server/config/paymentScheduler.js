const cron = require("node-cron");
const mongoose = require("mongoose");
const Payment = require("../models/Payment");

// Ensure database connection is established before running cron jobs
mongoose.connection.once("open", () => {
  console.log("Connected to the database. Starting cron job for recurring payments.");

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // Find all active recurring payments that are due
      const recurringPayments = await Payment.find({
        isRecurring: true,
        status: "active",
        nextExecution: { $lte: now },
      });

      for (const payment of recurringPayments) {
        // Create a new payment transaction
        const newPayment = new Payment({
          user: payment.user,
          biller: payment.biller,
          amount: payment.amount,
          status: "completed",
          isRecurring: false, // This is a one-time transaction
        });

        await newPayment.save();
        console.log(`Recurring payment of $${payment.amount} from user ${payment.user} to biller ${payment.biller} completed.`);

        // Update next execution date
        let nextDate = new Date(payment.nextExecution);
        if (payment.frequency === "daily") nextDate.setDate(nextDate.getDate() + 1);
        else if (payment.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7);
        else if (payment.frequency === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);

        // Update the next execution date in the original recurring payment
        payment.nextExecution = nextDate;
        await payment.save();
      }
    } catch (error) {
      console.error("Error processing recurring payments:", error);
    }
  });
});
