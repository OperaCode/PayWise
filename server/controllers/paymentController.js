const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Biller = require("../models/billerModel");
const Payment = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const { updateBillerAmount } = require("../hooks/aggrAmount");

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

//to fund wallet 
const fundWallet = asyncHandler(async (req, res) => {
  try {
    console.log("Received Flutterwave payment request:", req.body);

    const { userId, amount, transactionId } = req.body;

    if (!transactionId) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction ID is missing." });
    }

    // Corrected API call
    const flutterwaveResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    let data;
    try {
      data = await flutterwaveResponse.json();
    } catch (error) {
      console.error("Failed to parse Flutterwave response:", error);
      return res
        .status(500)
        .json({ success: false, message: "Invalid response from Flutterwave" });
    }

    console.log("Flutterwave Full Response:", JSON.stringify(data, null, 2));

    if (data.status === "success" && data.data.status === "successful") {
      // ✅ Find the user by userId
      let user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Update user's wallet balance
      user.wallet.balance += amount;

      await user.save();

      // Send updated wallet balance to frontend
      res.json({
        success: true,
        message: "Payment verified and wallet funded.",
        walletBalance: user.wallet.balance,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed." });
    }
  } catch (error) {
    console.error("Error handling Flutterwave payment:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


const withdrawToBank = asyncHandler(async (req, res) => {
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
        debit_currency: "NGN",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // If successful, return response
    if (response.data.status === "success") {
      return res.status(200).json({
        message: "Withdrawal request successful! Processing...",
        updatedBalance: user.wallet.balance,
        transactionId: response.data.data.id,
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

    console.log("🔹 Searching for sender with ID:", senderId);

    // Get sender
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
    console.log("✅ Sender found:", sender.email);

    // Check sender balance
    if (sender.wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    console.log("Sender's wallet before:", sender.wallet.balance);

    // Deduct amount from sender's wallet
    sender.wallet.balance -= Number(amount);

    let recipient = await User.findOne({ email: recipientEmail.toLowerCase() });
    // If recipient is a user, update their wallet balance
    if (recipient) {
      recipient.wallet.balance += Number(amount);
    }

    // Create a new payment record
    const newPayment = new Payment({
      user: senderId,
      recipientUser: recipient ? recipient._id : null,
      amount: Number(amount),
      transactionRef: `P2P-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status: "successful",
      paymentType: 'Transfer',
      createdAt: new Date(),
      scheduleDate: new Date(),
    });

    await newPayment.save();
    await sender.save();
    if (recipient) await recipient.save();

    console.log("Sender's wallet after:", sender.wallet.balance);

    // Update totalAmountPaid for biller if the recipient is a biller
    const biller = await Biller.findOne({ email: recipient.email });
    if (biller) {
      console.log("🔹 Updating totalAmountPaid for biller:", recipient.email);
      biller.totalAmountPaid += Number(amount);
      await biller.save();
      console.log("Updated totalAmountPaid:", biller.totalAmountPaid);
    }

    return res.status(200).json({
      message: `Transfer successful! You sent $${amount} to ${recipientEmail}`,
      updatedBalance: sender.wallet.balance,
    });
  } catch (error) {
    console.error("P2P Transfer Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const scheduleTransfer = asyncHandler(async (req, res) => {
  try {
    const { billerEmail, amount, scheduleDate, transactionPin } = req.body;
    const userId = req.userId; // Extracted from token

    

    // 1. Validate basic fields
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (
      !billerEmail ||
      isNaN(amount) ||
      amount <= 0 ||
      !scheduleDate ||
      !transactionPin
    ) {
      return res
        .status(400)
        .json({ message: "Missing or invalid required fields." });
    }


    // 2. Validate the scheduled date
    const scheduledDate = new Date(scheduleDate);
    if (isNaN(scheduledDate.getTime()) || scheduledDate < new Date()) {
      return res.status(400).json({ message: "Invalid schedule date." });
    }

    // 3. Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    console.log("Transaction PIN from request:", transactionPin);
    console.log("Stored transaction PIN:", user.transactionPin);
    

    // 4. Optional: Validate transaction PIN
    const isPinValid = await bcrypt.compare(transactionPin, user.transactionPin);
    console.log("Is PIN valid?", isPinValid);
    if (!isPinValid) {
      return res.status(403).json({ message: "Invalid transaction PIN." });
    }

    // 5. Find the biller by email
    const recipient = await Biller.findOne({ email: billerEmail });
    if (!recipient) {
      return res.status(404).json({ message: "Biller not found." });
    }

    // 6. Create the scheduled payment
    const newPayment = new Payment({
      user: userId,
      recipientBiller: recipient._id,
      amount,
      transactionRef: `SCH-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      scheduleDate: scheduledDate,
      paymentType: 'Scheduled',
      status: "pending",
    });

    await newPayment.save();

    // 7. Update totalAmountPaid (optional logic)
    recipient.totalAmountPaid += Number(amount);
    await recipient.save();

    // 8. Send response
    return res.status(201).json({
      message: "Payment scheduled successfully.",
      scheduledPayment: newPayment,
    });
  } catch (error) {
    console.error("Error scheduling payment:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

const getUserPaymentHistory = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("user", "firstName serviceType")
      .populate("recipientUser", "firstName lastName serviceType")
      .populate("recipientBiller", "name serviceType");

    res.status(200).json({ data: payments });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res
      .status(500)
      .json({
        message: "Error fetching payment history",
        error: error.message,
      });
  }
};

const totalPayments = asyncHandler(async (req, rers) => {
  try {
    const totalPayments = await Payment.aggregate([
      {
        $group: {
          _id: "$billerId",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "billers",
          localField: "_id",
          foreignField: "_id",
          as: "billerInfo",
        },
      },
      {
        $unwind: "$billerInfo",
      },
      {
        $project: {
          billerName: "$billerInfo.name",
          totalAmount: 1,
        },
      },
    ]);

    res.json(totalPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// const scheduleTransfer = asyncHandler(async (req, res) => {
//   try {
//     const { userId, billerName, amount, dueDate } = req.body;

//     const newScheduledPayment = new ScheduledPayment({
//       billerName,
//       amount,
//       dueDate,
//       status: "pending",
//     });

//     await newScheduledPayment.save();

//     res.json({ success: true, message: "Payment scheduled successfully" });
//   } catch (error) {
//     console.error("Error scheduling payment:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

const pauseRecurringPayment = asyncHandler(async (req, res) => {
  try {
    await RecurringPayment.findByIdAndUpdate(req.params.id, {
      status: "paused",
    });
    res.json({ message: "Recurring payment paused." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  fundWallet,
  p2PTransfer,
  getUserPaymentHistory,
  totalPayments,
  scheduleTransfer,
  pauseRecurringPayment,
};
