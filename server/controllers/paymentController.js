const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel");


const createPayment = asyncHandler(async (req, res) => {
    try {
        const { userId, vendorId, amount, frequency } = req.body;
        
        const  nextPaymentDate = new Date();
    switch (frequency) {
      case 'daily':
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 1);
        break;
      case 'weekly':
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
        break;
      case 'bi-weekly':
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 14);
        break;
      case 'monthly':
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        break;
      default:
        nextPaymentDate = null; // One-time payment
    }

    
        // Generate a unique transaction reference
       // const transactionReference = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
        const newPayment = new Payment({
            user: userId,
            vendor: vendorId,
            amount,
            frequency,
            nextPaymentDate
        });
    
        await newPayment.save();
    
        res.status(201).json({ message: 'Payment initiated', payment });
      } catch (error) {
        res.status(500).json({ error: 'Payment initiation failed', details: error.message });
      }
    }
);


const initiatePayment = asyncHandler(async(req, res) => {
    try {
        const { transactionReference } = req.body;
        const payment = await Payment.findOne({ transactionReference });
    
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
    
        if (payment.status !== 'pending') {
          return res.status(400).json({ error: 'Payment already processed' });
        }
    
        // Simulate Payment Processing (Replace this with Paystack API logic)
        const paymentSuccess = Math.random() > 0.2; // Simulate 80% success rate
    
        if (paymentSuccess) {
          payment.status = 'successful';
          payment.completedAt = new Date();
        } else {
          payment.status = 'failed';
          payment.failureReason = 'Insufficient funds'; // Example reason
          payment.retryCount += 1;
        }
    
        await payment.save();
    
        res.json({ message: `Payment ${payment.status}`, payment });
      } catch (error) {
        res.status(500).json({ error: 'Payment processing failed', details: error.message });
      }
    }
);


const makeInstantPayment = asyncHandler(async(re,res)=>{
    try {
        const { userId, vendorId, amount } = req.body;
    
        // Validate input
        if (!userId || !vendorId || !amount || amount <= 0) {
          return res.status(400).json({ error: 'Invalid payment details' });
        }
    
        // Check if the vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
          return res.status(404).json({ error: 'Vendor not found' });
        }
    
        // Check if the user has a wallet
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
          return res.status(404).json({ error: 'Wallet not found' });
        }
    
        // Ensure the wallet has enough balance
        if (wallet.balance < amount) {
          return res.status(400).json({ error: 'Insufficient wallet balance' });
        }
    
        // Deduct the amount from wallet balance
        wallet.balance -= amount;
    
        // Create a transaction record
        const transaction = new Transaction({
          user: userId,
          vendor: vendorId,
          amount,
          status: 'successful',
          transactionType: 'wallet-payment'
        });
    
        // Save the transaction and update the wallet
        await transaction.save();
        wallet.transactions.push(transaction._id);
        await wallet.save();
    
        return res.status(200).json({
          message: 'Payment successful',
          transactionId: transaction._id,
          newBalance: wallet.balance
        });
    
      } catch (error) {
        console.error('Payment Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
});

const scehduledPayment = asyncHandler(async(req, res)=>{
    try {
        const { userId, vendorId, amount, scheduledAt } = req.body;
    
        // Validate input
        if (!userId || !vendorId || !amount || amount <= 0 || !scheduledAt) {
          return res.status(400).json({ error: 'Invalid payment details' });
        }
    
        const paymentTime = new Date(scheduledAt);
        if (paymentTime <= new Date()) {
          return res.status(400).json({ error: 'Scheduled time must be in the future' });
        }
    
        // Ensure the vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
          return res.status(404).json({ error: 'Vendor not found' });
        }
    
        // Ensure the user has a wallet
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
          return res.status(404).json({ error: 'Wallet not found' });
        }
    
        // Store the scheduled payment
        const scheduledPayment = new ScheduledPayment({
          user: userId,
          vendor: vendorId,
          amount,
          scheduledAt: paymentTime
        });
    
        await scheduledPayment.save();
    
        return res.status(200).json({ message: 'Payment scheduled successfully', paymentId: scheduledPayment._id });
    
      } catch (error) {
        console.error('Schedule Payment Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
});

const retryPayment =  asyncHandler(async(req, res)=>{
    try {
        const { transactionReference } = req.body;
        const payment = await Payment.findOne({ transactionReference });
    
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
    
        if (payment.status !== 'failed') {
          return res.status(400).json({ error: 'Only failed payments can be retried' });
        }
    
        if (payment.retryCount >= 3) {
          return res.status(400).json({ error: 'Max retry limit reached' });
        }
    
        payment.status = 'pending';
        await payment.save();
    
        // Call processPayment to attempt the retry
        return processPayment(req, res);
      } catch (error) {
        res.status(500).json({ error: 'Payment retry failed', details: error.message });
      }
});


const getPayment = asyncHandler(async(req, res)=>{
    try {
        const { transactionReference } = req.params;
        const payment = await Payment.findOne({ transactionReference });
        //const payment = await Payment.findOne({ transactionReference }).populate('user vendor');
    
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
    
        res.json(payment);
      } catch (error) {
        res.status(500).json({ error: 'Payment retrieval failed', details: error.message });
      }
});

const getPayments = asyncHandler(async(req, res)=>{
    try {
        const payments = await Payment.find({ user: req.user.id });
        //const payments = await Payment.find({ user: userId }).populate('vendor');
    
        if (!payments) return res.status(404).json({ error: 'No payments found' });
    
        res.json(payments);
      } catch (error) {
        res.status(500).json({ error: 'Payment retrieval failed', details: error.message });
      }
})







module.exports = { createPayment, initiatePayment, retryPayment, makeInstantPayment};