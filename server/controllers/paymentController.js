const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Biller = require("../models/billerModel");
const Payment = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
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

    // Step 1: Verify transaction with Flutterwave
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
      const usdEquivalent = reward / 100;
      user.wallet.rewardHistory.push({
        amount: reward,
        usdEquivalent: usdEquivalent,
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
  const { userId, amount, account_bank, account_number, narration } = req.body;
  console.log(req.body);

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.wallet.balance < amount) {
    return res.status(400).json({ message: "Insufficient wallet balance" });
  }

  const reference = `withdrawal-${Date.now()}`;
  const payload = {
    account_bank,
    account_number,
    amount,
    narration: narration || "PayWise Withdrawal",
    currency: "USD",
    reference,
    callback_url: "https://yourdomain.com/webhook/flutterwave",
    debit_currency: "USD",
  };

  let flutterwaveResponse;

  if (
    process.env.NODE_ENV === "development" ||
    process.env.MOCK_FLW === "true"
  ) {
    flutterwaveResponse = {
      status: "success",
      message: "Mock withdrawal initiated",
      data: {
        id: Math.floor(Math.random() * 10000000),
        reference,
        amount,
        account_number,
        account_bank,
        currency: "USD",
      },
    };
  } else {
    const response = await axios.post(
      "https://api.flutterwave.com/v3/transfers",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );
    flutterwaveResponse = response.data;
  }

  if (flutterwaveResponse.status === "success") {
    user.wallet.balance -= amount;
    await user.save();

    console.log("Withdraw Amount:", amount);
    console.log("Flutterwave Response:", flutterwaveResponse);

    const newPayment = new Payment({
      user: userId,
      type: "withdrawal",
      amount,
      transactionRef: flutterwaveResponse.data?.reference || uuidv4(),
      status: "Successful",
      paymentType: "withdrawal",
      paidAt: new Date(),
      description: "Wallet withdrawal via Flutterwave",
      reference,
      bankAccount: account_number,
    });

    await newPayment.save();

    return res.status(200).json({
      message: "Withdrawal initiated successfully",
      details: flutterwaveResponse.message,
    });
  } else {
    return res
      .status(500)
      .json({ message: "Transfer failed", details: flutterwaveResponse });
  }
});

const p2PTransfer = asyncHandler(async (req, res) => {
  try {
    const { senderId, recipientEmail, amount } = req.body;

    if (!senderId || !recipientEmail || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid transfer details" });
    }

    const transferAmount = Number(amount);

    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ message: "Sender not found" });

    if (sender.wallet.balance < transferAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    sender.wallet.balance -= transferAmount;

    // Find recipient and validate
    const recipient = await User.findOne({
      email: recipientEmail.toLowerCase(),
    });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    recipient.wallet.balance += transferAmount;

    // Reward Calculation for sender
    const reward =
      transferAmount > 100
        ? 10
        : parseFloat((transferAmount * 0.02).toFixed(2));

    sender.wallet.payCoins += reward;
    const usdEquivalent = reward / 100;
    sender.wallet.rewardHistory.push({
      amount: reward,
      usdEquivalent: usdEquivalent,
      reason: `P2P transfer of $${transferAmount} (Reward)`,
    });

    // Create the payment transaction
    const newPayment = new Payment({
      user: senderId,
      recipientUser: recipient._id,
      amount: transferAmount,
      transactionRef: `P2P-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status: "Successful",
      paymentType: "Transfer",
      createdAt: new Date(),
      scheduleDate: new Date(),
    });

    // Save sender, recipient, and payment atomically (consider using a transaction for consistency)
    await Promise.all([sender.save(), recipient.save(), newPayment.save()]);

    // If the recipient is a biller, update their totalAmountPaid
    const biller =
      recipient && (await Biller.findOne({ email: recipient.email }));
    if (biller) {
      biller.totalAmountPaid += transferAmount;
      await biller.save();
    }

    return res.status(200).json({
      message: `Transfer successful! You sent $${transferAmount} to ${recipientEmail}`,
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

    const userId = req.userId;

    // 1. Validate fields
    if (!userId)
      return res.status(401).json({ message: "Unauthorized. Please log in." });

    const parsedAmount = parseFloat(amount);
    if (
      isNaN(parsedAmount) ||
      parsedAmount <= 0 ||
      !billerEmail ||
      !scheduleDate ||
      !transactionPin
    ) {
      return res
        .status(400)
        .json({ message: "Missing or invalid required fields." });
    }

    // 2. Parse and validate the schedule date
    const scheduledDate = new Date(scheduleDate);
    scheduledDate.setSeconds(0, 0);
    if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      return res.status(400).json({ message: "Invalid schedule date." });
    }

    // 3. Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // 4. Validate transaction PIN
    if (!user.transactionPin) {
      return res.status(400).json({
        message: "Transaction PIN not set. Please set your PIN first.",
      });
    }

    const isPinValid = await bcrypt.compare(
      transactionPin,
      user.transactionPin
    );
    if (!isPinValid) {
      return res.status(403).json({ message: "Invalid transaction PIN." });
    }

    // 5. Check wallet balance
    if (user.wallet.balance < parsedAmount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // 6. Lock/reserve funds
    user.wallet.balance -= parsedAmount;
    user.wallet.lockedAmount += parsedAmount;
    user.markModified("wallet");
    await user.save();

    // 7. Find biller
    const recipient = await Biller.findOne({ email: billerEmail });
    if (!recipient) {
      return res.status(404).json({ message: "Biller not found." });
    }

    // 8. Save scheduled payment
    const newPayment = await Payment.create({
      user: userId,
      recipientBiller: recipient._id,
      amount: parsedAmount,
      transactionRef: `SCH-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      scheduleDate: scheduledDate,
      paymentType: "Scheduled",
      status: "Pending",
      isRecurring: false,
      isAutoPayment: false,
    });

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
    const userId = req.userId;
    const {
      billerEmails,
      amount, // still kept in case you want to show the user-requested value
      startDate,
      frequency,
      occurrences,
      transactionPin,
    } = req.body;

    // Validate PIN
    const user = await User.findById(userId);
    const isPinValid = await bcrypt.compare(
      transactionPin,
      user.transactionPin
    );
    if (!isPinValid) {
      return res.status(403).json({ message: "Invalid transaction PIN." });
    }

    // Get billers by email
    const billers = await Biller.find({ email: { $in: billerEmails } });
    if (!billers || billers.length === 0) {
      return res.status(400).json({ message: "No matching billers found." });
    }

    // Calculate total required amount for all billers
    const totalAmount = billers.reduce(
      (sum, biller) => sum + biller.serviceAmount,
      0
    );

    // Ensure sufficient wallet balance
    if (user.wallet.balance < totalAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Lock the total amount
    user.wallet.balance -= totalAmount;
    user.wallet.lockedAmount += totalAmount;
    user.markModified("wallet");
    await user.save();

    // Generate recurring payments
    const scheduledPayments = await Promise.all(
      billers.map((biller) => {
        const nextExecutionDate = calculateNextExecutionDate(
          startDate,
          frequency
        );

        return Payment.create({
          user: userId,
          recipientBiller: biller._id,
          amount: biller.serviceAmount,
          status: "Pending",
          transactionRef: `ATP-${Date.now()}-${Math.floor(
            Math.random() * 10000
          )}`,
          isRecurring: true,
          frequency,
          isAutoPayment: true,
          scheduleDate: new Date(startDate),
          nextExecution: nextExecutionDate,
          recurrence: {
            occurrencesLeft: occurrences,
            lastPaidAt: new Date(startDate),
          },
          paymentType: "Scheduled",
          description: `Recurring payment for ${biller.name}`,
        });
      })
    );

    return res.status(201).json({
      message: "Recurring payments scheduled.",
      payments: scheduledPayments,
    });
  } catch (error) {
    console.error("Recurring schedule error:", error);
    res.status(500).json({ message: "Failed to schedule recurring payments." });
  }
};

// Function to calculate the next execution date based on frequency
const calculateNextExecutionDate = (startDate, frequency) => {
  const date = new Date(startDate);
  const freq = frequency.toLowerCase();

  switch (freq) {
    case "daily":
      date.setDate(date.getDate() + 1);
      return date;
    case "weekly":
      date.setDate(date.getDate() + 7);
      return date;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      return date;
    case "once":
      // One-time payments don't recur
      return null;
    default:
      throw new Error("Invalid frequency");
  }
};

//payment history for recent transactions and transaction history
const getUserPaymentHistory = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Pagination params from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    // Count total payments for pagination metadata
    const total = await Payment.countDocuments({ user: userId });

    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "firstName serviceType")
      .populate("recipientUser", "firstName lastName serviceType")
      .populate("recipientBiller", "name serviceType");

    res.status(200).json({
      data: payments,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({
      message: "Error fetching payment history",
      error: error.message,
    });
  }
};

const redeemPayCoin = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    console.log("Redeem request amount:", amount); // Debug

    if (amount < 100) {
      return res
        .status(400)
        .json({ message: "Minimum redeemable amount is 100 PayCoins." });
    }

    const user = await User.findById(userId);
    console.log("User PayCoins:", user.wallet?.payCoins); // Debug

    if (!user || user.wallet.payCoins < amount) {
      return res.status(400).json({ message: "Insufficient PayCoins." });
    }

    // Deduct from reward balance and credit wallet
    user.wallet.payCoins -= amount;
    user.wallet.balance += amount;

    await user.save();

    res.status(200).json({ message: "Redeemed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//total payment for charts
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

//aggregagetes for analytics
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

// delete transaction
const deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;
  console.log(req.params);
  try {
    const transaction = await Payment.findById(transactionId);

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    const userId = req.userId; // Assumes user ID is attached to req via auth middleware
    if (transaction.user.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "User not authorized" });
    }

    await transaction.deleteOne(); // or Payment.findByIdAndDelete(transactionId)

    return res
      .status(200)
      .json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  fundWallet,
  p2PTransfer,
  getUserPaymentHistory,
  paymentAggregates,
  withdrawToBank,
  scheduleRecurring,
  redeemPayCoin,
  totalPayments,
  scheduleTransfer,
  pauseRecurringPayment,
  deleteTransaction,
};
