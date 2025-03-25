

const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userModel")
const Biller = require("../models/billerModel")
const Payment = require("../models/paymentModel")
const bcrypt = require("bcrypt")



// const fundWallet1 = asyncHandler(async (req, res) => {
//   try {
//     console.log("Received Flutterwave payment request:", req.body);

//     const { userId, amount, transactionId } = req.body;

//     if (!transactionId) {
//       return res.status(400).json({ success: false, message: "Transaction ID is missing." });
//     }

//     // Corrected API call
//     const flutterwaveResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
//       },
//     });

//     let data;
//     try {
//       data = await flutterwaveResponse.json();
//     } catch (error) {
//       console.error("Failed to parse Flutterwave response:", error);
//       return res.status(500).json({ success: false, message: "Invalid response from Flutterwave" });
//     }

//     console.log("Flutterwave Full Response:", JSON.stringify(data, null, 2));

//     // Verify if the payment is successful
//     if (data.status === "success" && data.data.status === "successful") {
//       // Update wallet balance (Assuming you have a Wallet model)
//       // Example: await Wallet.updateOne({ userId }, { $inc: { balance: amount } });

//       res.json({ success: true, message: "Payment verified and wallet funded." });
//     } else {
//       res.status(400).json({ success: false, message: "Payment verification failed." });
//     }
//   } catch (error) {
//     console.error("Error handling Flutterwave payment:", error);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });

const fundWallet = asyncHandler(async (req, res) => {
  try {
    console.log("Received Flutterwave payment request:", req.body);

    const { userId, amount, transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ success: false, message: "Transaction ID is missing." });
    }

    // Corrected API call
    const flutterwaveResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    });

    let data;
    try {
      data = await flutterwaveResponse.json();
    } catch (error) {
      console.error("Failed to parse Flutterwave response:", error);
      return res.status(500).json({ success: false, message: "Invalid response from Flutterwave" });
    }

    console.log("Flutterwave Full Response:", JSON.stringify(data, null, 2));

    if (data.status === "success" && data.data.status === "successful") {
      // ✅ Find the user by userId
      let user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // ✅ Update user's wallet balance
      user.wallet.balance += amount;

      await user.save(); // ✅ Save the updated user data

      // ✅ Send updated wallet balance to frontend
      res.json({
        success: true,
        message: "Payment verified and wallet funded.",
        walletBalance: user.wallet.balance, // ✅ Return new balance
      });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed." });
    }
  } catch (error) {
    console.error("Error handling Flutterwave payment:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

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










module.exports = {fundWallet,transferFunds, scheduleTransfer, pauseRecurringPayment };