

const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userModel")
const Biller = require("../models/billerModel")
const Payment = require("../models/paymentModel")
const bcrypt = require("bcrypt")



const transferFunds = asyncHandler(async (req, res) => {
  try {
    const { senderEmail, receiverEmail, amount, method, pin } = req.body;
    //console.log(req.body)

    // Validate data
    if (!senderEmail || !receiverEmail || !amount || amount <= 0 || !method) {
      return res.status(400).json({ message: "Invalid transfer request" });
    }

    if (!["wallet", "rewards"].includes(method)) {
      return res.status(400).json({ message: "Invalid payment method. Choose 'wallet' or 'rewards'." });
    }


    // Fetch sender and receiver
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Ensure sender has set a transaction PIN
    if (!sender.transactionPin) {
      return res.status(400).json({ message: "You must set a transaction PIN before making transfers." });
    }

    // Validate transaction PIN
    const isPinValid = await bcrypt.compare(pin, sender.transactionPin || "");
    if (!isPinValid) {
      return res.status(403).json({ message: "Invalid transaction PIN" });
    }

    // Validate balance before deducting
    if (method === "wallet") {
      if (sender.wallet.balance < amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      sender.wallet.balance -= amount; // Deduct amount
    } else if (method === "rewards") {
      if (sender.wallet.rewards < amount) {
        return res.status(400).json({ message: "Insufficient rewards balance" });
      }
      sender.wallet.rewards -= amount;
    }

    // Update sender's balance
    await sender.save();

    // Increment receiver's balance using `$inc`
    await User.updateOne(
      { email: receiverEmail },
      { $inc: { "wallet.balance": amount } }
    );

    // Fetch updated receiver balance AFTER transaction
    const updatedReceiver = await User.findOne({ email: receiverEmail });

    return res.status(200).json({
      message: "Transfer successful.",
      senderWalletBalance: sender.wallet.balance,
      senderRewardsBalance: sender.wallet.rewards,
      receiverWalletBalance: updatedReceiver.wallet.balance, // Correctly updated balance
      paymentMethod: method,
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

});

const scheduleTransfer = asyncHandler(async (req, res) => {
  try {
    const { senderEmail, receiverEmail, amount, frequency, isRecurring, startDate, transactionPin } = req.body;

    // Validate required fields
    if (!senderEmail || !receiverEmail || !amount || amount <= 0 || !startDate || !transactionPin || !frequency) {
      return res.status(400).json({ message: "Invalid transfer request. Missing required fields." });
    }

    // Fetch sender (user initiating the scheduled transfer)
    const sender = await User.findOne({ email: senderEmail });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Fetch receiver (PayWise user receiving the transfer)
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Validate frequency
    const validFrequencies = ["daily", "weekly", "monthly"];
    if (!validFrequencies.includes(frequency)) {
      return res.status(400).json({ error: "Invalid frequency. Must be 'daily', 'weekly', or 'monthly'." });
    }

    // Validate start date for recurring payments
    const nextExecution = new Date(startDate);
    if (isNaN(nextExecution.getTime())) {
      return res.status(400).json({ error: "Invalid startDate format." });
    }

    if (nextExecution < new Date()) {
      return res.status(400).json({ error: "Start date must be in the future." });
    }

    // Ensure sender has set a transaction PIN
    if (!sender.transactionPin) {
      return res.status(400).json({ message: "You must set a transaction PIN before making transfers." });
    }

    // Validate transaction PIN
    const isPinValid = await bcrypt.compare(transactionPin, sender.transactionPin);
    if (!isPinValid) {
      return res.status(403).json({ message: "Invalid transaction PIN" });
    }

    // Save the recurring payment in the database
    const recurringPayment = new Payment({
      user: sender._id,  // Sender of the payment
      biller: receiver._id,  // Receiver of the payment
      amount,
      frequency,
      nextExecution, // Scheduler will update this
      status: "active",
      isRecurring: true,
    });

    await recurringPayment.save();

    res.status(201).json({
      message: "Recurring payment scheduled successfully",
      recurringPayment,
    });

  } catch (error) {
    console.error("Error scheduling transfer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});

const pauseRecurringPayment = asyncHandler(async (req, res) => {
  try {
    await RecurringPayment.findByIdAndUpdate(req.params.id, { status: "paused" });
    res.json({ message: "Recurring payment paused." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});










module.exports = { transferFunds, scheduleTransfer, pauseRecurringPayment };