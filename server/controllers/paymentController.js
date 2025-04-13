const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Biller = require("../models/billerModel");
const Payment = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const { updateBillerAmount } = require("../hooks/aggrAmount");

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

    // ✅ Step 1: Verify transaction with Flutterwave
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

    const data = await flutterwaveResponse.json();
    console.log(
      "Flutterwave Verification Data:",
      JSON.stringify(data, null, 2)
    );

    // Step 2: Check if payment was successful
    if (data.status === "success" && data.data.status === "successful") {
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Step 3: Update wallet balance
      user.wallet.balance += amount;

      // Step 4: Add rewards (10 PayCoins if >$100)
      let reward = 0;

      if (amount > 100) {
        reward = 10; // Reward 10 PayCoins for top-ups above $100
      } else {
        reward = parseFloat((amount * 0.02).toFixed(2)); // Otherwise reward 2% of funded amount
      }

      // Add reward to payCoins balance and track it in rewardHistory
      user.wallet.payCoins += reward;
      user.wallet.rewardHistory.push({
        amount: reward,
        reason: `Wallet top-up of $${amount} (Reward)`,
      });

      await user.save();

      // Step 5: Log funding as a Payment
      const newPayment = new Payment({
        user: userId,
        amount,
        transactionRef: data.data.tx_ref || uuidv4(),
        status: "Successful",
        paymentType: "Funding",
        paidAt: new Date(),
        description: "Wallet funded via Flutterwave",
      });

      await newPayment.save();

      // Step 6: Send response
      res.json({
        success: true,
        message: "Wallet funded successfully.",
        walletBalance: user.wallet.balance,
        rewardEarned: reward,
        totalPayCoins: user.wallet.payCoins, // Include total PayCoins in the response
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed with Flutterwave.",
      });
    }
  } catch (error) {
    console.error("Error funding wallet:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while funding the wallet.",
    });
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
    console.log("Sender found:", sender.email);

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
      status: "Successful",
      paymentType: "Transfer",
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
      console.log("Updating totalAmountPaid for biller:", recipient.email);
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
    console.log("Incoming payload:", req.body);

    const userId = req.userId; // Extracted from token

    // 1. Validate fields
    if (!userId) return res.status(401).json({ message: "Unauthorized. Please log in." });

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !billerEmail || !scheduleDate || !transactionPin) {
      return res.status(400).json({ message: "Missing or invalid required fields." });
    }

    // 2. Parse the schedule date from the frontend (already in UTC)
    const scheduledDate = new Date(scheduleDate); // This will be parsed as UTC correctly
    scheduledDate.setSeconds(0, 0); // Ensure no sub-seconds
    
    // Validate the schedule date
    if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      return res.status(400).json({ message: "Invalid schedule date." });
    }

    // 3. Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // 4. Check transaction PIN
    const isPinValid = await bcrypt.compare(transactionPin, user.transactionPin);
    if (!isPinValid) return res.status(403).json({ message: "Invalid transaction PIN." });

    // 5. Find biller
    const recipient = await Biller.findOne({ email: billerEmail });
    if (!recipient) return res.status(404).json({ message: "Biller not found." });

    // 6. Check if there is already a pending payment for this biller
    // const existingPendingPayment = await Payment.findOne({
    //   user: userId,
    //   recipientBiller: recipient._id,
    //   status: "Pending",
    //   scheduleDate: { $gte: new Date() }, // Ensure it's a future due payment
    // });

    // if (existingPendingPayment) {
    //   return res.status(400).json({ message: "You already have a pending payment scheduled." });
    // }

    // 7. Save scheduled payment
    const newPayment = new Payment({
      user: userId,
      recipientBiller: recipient._id,
      amount: parsedAmount,  // Use parsed amount as a number
      transactionRef: `SCH-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      scheduleDate: scheduledDate,
      paymentType: "Scheduled",
      status: "Pending",
    });

    await newPayment.save();

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


const scheduleRecurring = async (req, res) => {
  try {
    const { id } = req.params;
    const { autoPayEnabled } = req.body;

    const biller = await Biller.findByIdAndUpdate(
      id,
      { autoPayEnabled },
      { new: true }
    );

    res.status(200).json({ message: "Autopay status updated", biller });
  } catch (error) {
    res.status(500).json({ error: "Failed to update autopay status" });
  }
};

const getUserPaymentHistory = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 })

      .populate("user", "firstName serviceType")
      .populate("recipientUser", "firstName lastName serviceType")
      .populate("recipientBiller", "name serviceType");

    res.status(200).json({ data: payments });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({
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

const paymentAggregates = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date();
    const lastMonthDate = new Date(currentDate);
    lastMonthDate.setMonth(currentDate.getMonth() - 1);

    // console.log("Getting payments for userId:", req.userId);
    // console.log("Searching from:", lastMonthDate.toISOString(), "to:", currentDate.toISOString());

    // Fetch only successful payments paid within the last month, excluding funding payments
    const payments = await Payment.find({
      user: req.userId,
      status: { $in: ["successful", "Successful"] },
      createdAt: { $gte: lastMonthDate, $lte: currentDate },
      paymentType: { $ne: "Funding" }, // Exclude 'Funding' payment type
    });

    //console.log("Fetched Payments Count:", payments.length);

    if (payments.length === 0) {
      return res.json({
        paymentHistory: [],
        insights: {
          totalSpent: 0,
          totalTransactions: 0,
          mostUsedService: "",
          largestPayment: 0,
          paymentFrequency: 0,
        },
      });
    }

    // Total amount spent (excluding funding payments)
    const totalSpent = payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );

    // Total transactions
    const totalTransactions = payments.length;

    // Most used service (by recipientBiller or recipientUser)
    const serviceUsage = {};
    payments.forEach((payment) => {
      const serviceId = payment.recipientBiller || payment.recipientUser;
      if (serviceId) {
        serviceUsage[serviceId] = (serviceUsage[serviceId] || 0) + 1;
      }
    });

    const mostUsedServiceId = Object.keys(serviceUsage).reduce(
      (a, b) => (serviceUsage[a] > serviceUsage[b] ? a : b),
      ""
    );

    let mostUsedServiceName = "";

    if (mostUsedServiceId) {
      // Try finding the service in Biller or User collections
      const biller = await Biller.findById(mostUsedServiceId);
      if (biller) {
        mostUsedServiceName = biller.name;
      } else {
        const user = await User.findById(mostUsedServiceId);
        if (user) {
          mostUsedServiceName = `${user.firstName} ${user.lastName}`;
        }
      }
    }

    // Largest single payment
    const largestPayment = Math.max(...payments.map((p) => p.amount));

    // Payment frequency: avg number of transactions per month in the past year
    const monthMap = {};
    payments.forEach((p) => {
      const key = `${p.createdAt.getFullYear()}-${p.createdAt.getMonth()}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    });

    const paymentFrequency =
      Object.values(monthMap).reduce((a, b) => a + b, 0) /
      Object.keys(monthMap).length;

    // Respond with insights and raw history
    res.json({
      paymentHistory: payments,
      insights: {
        totalSpent,
        totalTransactions,
        mostUsedService: mostUsedServiceName,
        largestPayment,
        paymentFrequency: parseFloat(paymentFrequency.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Error fetching payment analytics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

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
  paymentAggregates,
  scheduleRecurring,
  totalPayments,
  scheduleTransfer,
  pauseRecurringPayment,
};
