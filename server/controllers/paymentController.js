

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")
const Payment = require("../models/paymentModel")
const bcrypt = require("bcrypt")




const transferFunds = asyncHandler(async (req, res) => {
  try {
    const { senderId, receiverId, amount, pin } = req.body;
  
    // Validate request data
    if (!senderId || !receiverId || !amount || amount <= 0 ) {
      return res.status(400).json({ message: "Invalid transfer request" });
    }
  
    // Find sender
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
  
    // If sender has no PIN, ask them to set one
    if (!sender.transactionPin) {
      return res.status(400).json({ message: "You must set a transaction PIN before making transfers." });
    }

    // Validate transaction PIN
    const isPinValid = await bcrypt.compare(pin, sender.transactionPin || "");
    if (!isPinValid) {
      return res.status(403).json({ message: "Invalid transaction PIN" });
    }

    // Check sender balance
    if (sender.wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
  
    // Deduct from sender
    sender.wallet.balance -= amount;
    await sender.save();
  
    // Increment receiver balance using $inc for atomic update
    const receiver = await User.findByIdAndUpdate(
      receiverId,
      { $inc: { "wallet.balance": amount } },
      { new: true } // Return updated document
    );
  
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
  
    return res.status(200).json({
      message: "Transfer successful.",
      senderBalance: sender.wallet.balance,
      receiverBalance: receiver.wallet.balance,
    });
  
  } catch (error) {
    console.error("Transfer Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

});

const recurringTransfer = asyncHandler(async(req,res)=>{
  try {
    const { user, biller, amount, frequency, startDate } = req.body;


    // // Validate amount
    // if (typeof amount !== "number" || amount <= 0) {
    //   return res.status(400).json({ error: "Amount must be a positive number" });
    // }

    // Validate frequency
    const validFrequencies = ["daily", "weekly", "monthly"];
    if (!validFrequencies.includes(frequency)) {
      return res.status(400).json({ error: "Invalid frequency. Must be 'daily', 'weekly', or 'monthly'" });
    }

    // Validate startDate
    const nextExecution = new Date(startDate);
    if (isNaN(nextExecution.getTime())) {
      return res.status(400).json({ error: "Invalid startDate format" });
    }

    // Create recurring payment
    const recurringPayment = new Payment({
      user,
      biller,
      amount,
      frequency,
      nextExecution,
      isRecurring: true,
      status: "active",
    });

    await recurringPayment.save();
    res.status(201).json({ message: "Recurring payment scheduled", recurringPayment });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const pauseRecurringPayment = asyncHandler(async(req, res)=>{
  try {
    await RecurringPayment.findByIdAndUpdate(req.params.id, { status: "paused" });
    res.json({ message: "Recurring payment paused." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});










module.exports = { transferFunds, recurringTransfer, pauseRecurringPayment};