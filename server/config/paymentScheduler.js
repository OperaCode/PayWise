const cron = require('node-cron');
const Payment = require('../models/paymentModel');
const User = require('../models/userModel');
const Biller = require('../models/billerModel');

cron.schedule('* * * * *', async () => {
  const now = new Date();
  now.setSeconds(0, 0);
  console.log("Cron is running at", new Date().toISOString());

  try {
    // Fetch all due payments that are "Pending" and scheduled for a date <= current date/time
    const duePayments = await Payment.find({
      status: 'Pending',
      scheduleDate: { $lte: now }
    });

    if (duePayments.length === 0) {
      console.log("No due payments found.");
      return;
    }

    console.log("Found", duePayments.length, "due payments");
    console.log(duePayments.map(p => ({
      id: p._id,
      scheduleDate: p.scheduleDate,
      now,
      isDue: p.scheduleDate <= now
    })));

    for (const payment of duePayments) {
      const user = await User.findById(payment.user);
      if (!user) {
        console.log(`User not found for Payment ${payment._id}`);
        continue;
      }

      // Check if the user has enough balance to cover the payment
      if (user.wallet.balance < payment.amount) {
        console.log(`Skipping Payment ${payment._id} — Insufficient funds`);
        continue;
      }

      // Ensure that updates to the wallet balance are atomic to avoid race conditions
      user.wallet.balance -= payment.amount;
      try {
        await user.save();
      } catch (error) {
        console.log(`Error updating wallet for User ${user._id}: ${error.message}`);
        continue;
      }

      // Mark payment as successful
      payment.status = 'Successful';
      payment.paidAt = new Date();
      try {
        await payment.save();
      } catch (error) {
        console.log(`Error updating Payment ${payment._id}: ${error.message}`);
        continue;
      }

      // Update the biller's totalAmountPaid
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

      console.log(`AutoPaid $${payment.amount} for Payment ${payment._id}`);
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});
