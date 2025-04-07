const cron = require('node-cron');
const Payment = require('../models/paymentModel');
const User = require('../models/userModel');


cron.schedule('* * * * *', async () => {
  console.log('Running AutoPay Cron Job...');

  const now = new Date();

  try {
    // Find all due and pending scheduled payments
    const duePayments = await Payment.find({
      status: 'pending',
      scheduledDate: { $lte: now },
      //autoPay: true // Optional: if only autoPay ones should be picked
    });

    for (const payment of duePayments) {
      const user = await User.findById(payment.userId);

      if (!user || user.wallet.balance < payment.amount) {
        console.log(`Skipping Payment ${payment._id} — Insufficient funds`);
        continue;
      }

      // Deduct from user's wallet
      user.wallet.balance -= payment.amount;
      await user.save();

      // Mark payment as successful
      payment.status = 'successful';
      payment.paidAt = new Date();
      await payment.save();

      console.log(`AutoPaid $${payment.amount} for Payment ${payment._id}`);
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});
