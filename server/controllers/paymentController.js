

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

const withdrawToBank = asyncHandler(async(req, res)=>{
  try {
    const { userId, bankCode, accountNumber, amount } = req.body;

    // Ensure valid data
    if (!userId || !bankCode || !accountNumber || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal details" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if wallet balance is sufficient
    if (user.wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct the amount before initiating the transfer
    user.wallet.balance -= amount;
    await user.save();

    // Flutterwave API request
    const response = await axios.post(
      "https://api.flutterwave.com/v3/transfers",
      {
        account_bank: bankCode, // Bank code (e.g., 044 for Access Bank)
        account_number: accountNumber,
        amount: amount,
        currency: "NGN", // Adjust based on the country
        narration: "PayWise Wallet Withdrawal",
        reference: `txn-${Date.now()}`, // Unique reference
        callback_url: "https://yourapp.com/webhook",
        debit_currency: "NGN"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // If successful, return response
    if (response.data.status === "success") {
      return res.status(200).json({
        message: "Withdrawal request successful! Processing...",
        updatedBalance: user.wallet.balance,
        transactionId: response.data.data.id
      });
    } else {
      // If transfer fails, refund the wallet
      user.wallet.balance += amount;
      await user.save();
      return res.status(400).json({ message: "Transfer failed, refunded" });
    }
  } catch (error) {
    console.error("Withdrawal Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const p2PTransfer = asyncHandler(async (req, res) => {
  try {
    const { senderId, recipientEmail, amount } = req.body;

    if (!senderId || !recipientEmail || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid transfer details" });
    }

    console.log("🔹 Searching for sender with ID:", senderId); // Debugging

    // Get sender
    const sender = await User.findOne({ _id: senderId }); // 🔄 Make sure _id is correct
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    console.log("✅ Sender found:", sender.email);

    // Get recipient
    const recipient = await User.findOne({ email: recipientEmail.toLowerCase() });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found. Ensure the email is correct." });
    }

    console.log("Sender's wallet before:", sender.wallet.balance);
    console.log("Recipient's wallet before:", recipient.wallet.balance);

    // Check sender balance
    if (sender.wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Perform transfer
    sender.wallet.balance -= amount;
    recipient.wallet.balance += amount;

    await sender.save();
    await recipient.save();

    console.log("Sender's wallet after:", sender.wallet.balance);
    console.log("Recipient's wallet after:", recipient.wallet.balance);

    return res.status(200).json({
      message: `Transfer successful! You sent $${amount} to ${recipientEmail}`,
      updatedBalance: sender.wallet.balance,
    });

  } catch (error) {
    console.error("❌ P2P Transfer Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Schedule a One-Time Payment to a Biller
const schedulePayment = asyncHandler(async (req, res) => {
  try {
    const { senderEmail, billerId, amount, startDate, transactionPin } = req.body;

    // 🔹 Validate required fields
    if (!senderEmail || !billerId || !amount || amount <= 0 || !startDate || !transactionPin) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // 🔹 Find the sender (user scheduling the payment)
    const sender = await User.findOne({ email: senderEmail });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found." });
    }

    // 🔹 Find the biller
    const biller = await Biller.findById(billerId);
    if (!biller) {
      return res.status(404).json({ message: "Biller not found." });
    }

    // 🔹 Validate start date
    const scheduledDate = new Date(startDate);
    if (isNaN(scheduledDate.getTime()) || scheduledDate < new Date()) {
      return res.status(400).json({ message: "Invalid start date." });
    }

    // 🔹 Ensure sender has a transaction PIN
    if (!sender.transactionPin) {
      return res.status(400).json({ message: "Set a transaction PIN before scheduling payments." });
    }

    // 🔹 Validate transaction PIN
    const isPinValid = await bcrypt.compare(transactionPin, sender.transactionPin);
    if (!isPinValid) {
      return res.status(403).json({ message: "Invalid transaction PIN" });
    }

    // 🔹 Create a scheduled payment record
    const scheduledPayment = new Payment({
      user: sender._id,  // Sender
      biller: biller._id, // Biller being paid
      amount,
      scheduledDate, // Date when payment will be executed
      status: "pending", // Payment remains pending until execution
    });

    await scheduledPayment.save();

    res.status(201).json({
      message: "Payment scheduled successfully.",
      scheduledPayment,
    });

  } catch (error) {
    console.error("Error scheduling payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


const getUserPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const payments = await Payment.find({ user: userId })
      .populate('biller', 'name') // Fetch biller name
      .sort({ createdAt: -1 }); // Show recent transactions first

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment history', error });
  }
};


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










module.exports = {fundWallet,p2PTransfer, getUserPaymentHistory,scheduleTransfer, pauseRecurringPayment , schedulePayment };