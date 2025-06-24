const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Biller = require("../models/billerModel");
const Payment = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { updateBillerAmount } = require("../hooks/aggrAmount");

//to fund wallet
const fundWallet = asyncHandler(async (req, res) => {
  try {
    const { userId, transactionId } = req.body;

    if (!transactionId) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction ID is missing." });
    }

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
    console.log(flutterwaveResponse);
    console.log("FLW Verified Data:", JSON.stringify(data, null, 2));

    if (data.status === "success" && data.data.status === "successful") {
      const user = await User.findById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      const verifiedAmount = data.data.amount;
      const txRef = data.data.tx_ref;

      // Prevent duplicate
      const existing = await Payment.findOne({ transactionRef: txRef });
      if (existing) {
        return res
          .status(200)
          .json({ success: true, message: "Already processed." });
      }

      // Update balance
      user.wallet.balance += verifiedAmount;

      // Calculate rewards
      let reward =
        verifiedAmount > 100
          ? 10
          : parseFloat((verifiedAmount * 0.02).toFixed(2));
      user.wallet.payCoins += reward;

      user.wallet.rewardHistory.push({
        amount: reward,
        usdEquivalent: reward / 100,
        reason: `Wallet top-up of $${verifiedAmount} (Reward)`,
      });

      user.markModified("wallet");
      await user.save();

      const newPayment = new Payment({
        user: userId,
        amount: verifiedAmount,
        transactionRef: txRef,
        status: "Successful",
        paymentType: "Funding",
        paidAt: new Date(),
        description: "Wallet funded via Flutterwave",
      });

      await newPayment.save();

      return res.status(200).json({
        success: true,
        message: "Wallet funded successfully.",
        walletBalance: user.wallet.balance,
        rewardEarned: reward,
        totalPayCoins: user.wallet.payCoins,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment not successful." });
    }
  } catch (error) {
    console.error("Wallet Funding Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Funding error occurred." });
  }
});

const withdrawToBank = asyncHandler(async (req, res) => {
  const { userId, amount, account_bank, account_number, narration } = req.body;

  if (!userId || !amount || !account_bank || !account_number) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const reference = `withdrawal-${Date.now()}`;
  const withdrawalAmount = Math.floor(amount);

  const payload = {
    account_bank,
    account_number,
    amount: withdrawalAmount,
    narration: narration || "PayWise Withdrawal",
    currency: "USD",
    reference,
    callback_url: `${process.env.SERVER_URL}/payment/flutterwave`, // Webhook
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
        amount: withdrawalAmount,
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
    // Do NOT deduct balance yet

    const newPayment = new Payment({
      user: userId,
      type: "withdrawal",
      amount: withdrawalAmount,
      transactionRef: reference,
      status: "Pending", // Set as pending
      paymentType: "withdrawal",
      reference,
      paidAt: null,
      bankAccount: account_number,
      description: "Withdrawal initiated, awaiting webhook confirmation",
    });

    await newPayment.save();

    return res.status(200).json({
      message: "Withdrawal initiated and pending confirmation",
      details: flutterwaveResponse.message,
    });
  } else {
    return res.status(500).json({
      message: "Flutterwave transfer failed",
      details: flutterwaveResponse,
    });
  }
});

const flutterwaveWebhookHandler = asyncHandler(async (req, res) => {
  const hash = crypto
    .createHmac("sha256", process.env.FLW_SECRET_HASH)
    .update(JSON.stringify(req.body))
    .digest("hex");

  const flutterwaveSignature = req.headers["verif-hash"];
  if (process.env.NODE_ENV === "production" && hash !== flutterwaveSignature) {
    return res.status(401).json({ message: "Invalid webhook signature" });
  }

  const payload = req.body;

  if (payload.event === "charge.completed") {
    const txRef = payload.data.tx_ref;
    const amount = payload.data.amount;
    const email = payload.data.customer.email;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = await Payment.findOne({ transactionRef: txRef });
    if (existing) return res.status(200).json({ message: "Already processed" });

    user.wallet.balance += amount;

    let reward = amount > 100 ? 10 : parseFloat((amount * 0.02).toFixed(2));
    user.wallet.payCoins += reward;

    user.wallet.rewardHistory.push({
      amount: reward,
      usdEquivalent: reward / 100,
      reason: `Wallet top-up via Flutterwave Webhook`,
    });

    user.markModified("wallet");
    await user.save();

    await new Payment({
      user: user._id,
      amount,
      transactionRef: txRef,
      status: "Successful",
      paymentType: "Funding",
      paidAt: new Date(),
      description: "Wallet funded via Flutterwave Webhook",
    }).save();

    return res.status(200).json({ message: "Wallet funded via webhook" });
  }

  if (payload.event === "transfer.completed") {
    const { reference, status } = payload.data;

    if (status !== "SUCCESSFUL") {
      return res.status(200).json({ message: "Transfer not successful" });
    }

    const payment = await Payment.findOne({
      $or: [
        { reference: reference },
        { transactionRef: reference }, // fallback
      ],
    });

    if (!payment || payment.status === "Successful") {
      return res
        .status(200)
        .json({ message: "Already processed or not found" });
    }

    const user = await User.findById(payment.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wallet.balance < payment.amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance on confirmation" });
    }

    user.wallet.balance -= payment.amount;

    user.markModified("wallet");
    await user.save();

    payment.status = "Successful";
    payment.paidAt = new Date();
    await payment.save();

    return res
      .status(200)
      .json({ message: "Withdrawal confirmed via webhook" });
  }

  res.status(200).json({ message: "Event not handled" });
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
    // const biller =
    //   recipient && (await Biller.findOne({ email: recipient.email }));
    const biller = await Biller.findOne({
      email: recipient.email.toLowerCase(),
      user: senderId, // Ensure biller belongs to sender
    });
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
    // const recipient = await Biller.findOne(payment.biller);
    const recipient = await Biller.findOne({
      email: billerEmail,
      user: userId,
    });

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

// const scheduleRecurring = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const {
//       billerEmails,
//       amount, // still kept in case you want to show the user-requested value
//       startDate,
//       frequency,
//       occurrences,
//       transactionPin,
//     } = req.body;

//     // Validate PIN
//     const user = await User.findById(userId);
//     const isPinValid = await bcrypt.compare(
//       transactionPin,
//       user.transactionPin
//     );
//     if (!isPinValid) {
//       return res.status(403).json({ message: "Invalid transaction PIN." });
//     }

//     // Get billers by email
//     const billers = await Biller.find({ email: { $in: billerEmails } });
//     if (!billers || billers.length === 0) {
//       return res.status(400).json({ message: "No matching billers found." });
//     }

//     // Calculate total required amount for all billers

//     const totalAmount = billers.reduce(
//       (sum, biller) => sum + biller.serviceAmount,
//       0
//     );

//     const parsedAmount = parseFloat(totalAmount);

//     // Ensure sufficient wallet balance
//     if (user.wallet.balance < parsedAmount) {
//       return res.status(400).json({ message: "Insufficient balance" });
//     }

//     // Lock the total amount
//     user.wallet.balance -= parsedAmount;
//     user.wallet.lockedAmount += parsedAmount;
//     user.markModified("wallet");
//     await user.save();

//     // Generate recurring payments
//     const scheduledPayments = await Promise.all(
//       billers.map((biller) => {
//         const nextExecutionDate = calculateNextExecutionDate(
//           startDate,
//           frequency
//         );

//         return Payment.create({
//           user: userId,
//           recipientBiller: biller._id,
//           amount: biller.serviceAmount,
//           status: "Pending",
//           transactionRef: `ATP-${Date.now()}-${Math.floor(
//             Math.random() * 10000
//           )}`,
//           isRecurring: true,
//           frequency,
//           isAutoPayment: true,
//           scheduleDate: new Date(startDate),
//           nextExecution: nextExecutionDate,
//           recurrence: {
//             occurrencesLeft: occurrences,
//             lastPaidAt: new Date(startDate),
//           },
//           paymentType: "Scheduled",
//           description: `Recurring payment for ${biller.name}`,
//         });
//       })
//     );

//     return res.status(201).json({
//       message: "Recurring payments scheduled.",
//       payments: scheduledPayments,
//     });
//   } catch (error) {
//     console.error("Recurring schedule error:", error);
//     res.status(500).json({ message: "Failed to schedule recurring payments." });
//   }
// };

// Function to calculate the next execution date based on frequency

const scheduleRecurring = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      billerEmails,
      amount, // optional, retained for reference
      startDate,
      frequency,
      occurrences,
      transactionPin,
    } = req.body;

    // 1. Validate user and PIN
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isPinValid = await bcrypt.compare(
      transactionPin,
      user.transactionPin
    );
    if (!isPinValid) {
      return res.status(403).json({ message: "Invalid transaction PIN." });
    }

    // 2. Get billers by email
    // const billers = await Biller.find({ email: { $in: billerEmails } });
    const billers = await Biller.find({
      email: { $in: billerEmails },
      user: userId, // only fetch billers created/attached by the current user
    });

    if (!billers || billers.length === 0) {
      return res.status(400).json({ message: "No matching billers found." });
    }

    // 3. Calculate total required amount
    const totalAmount = billers.reduce(
      (sum, biller) => sum + parseFloat(biller.serviceAmount || 0),
      0
    );

    console.log("Wallet balance:", user.wallet.balance);
    console.log("Locked amount:", user.wallet.lockedAmount);
    console.log("Total scheduled amount:", totalAmount);
    console.log(
      "Each biller amount:",
      billers.map((b) => ({
        name: b.name,
        serviceAmount: b.serviceAmount,
      }))
    );

    // 4. Ensure sufficient wallet balance
    const availableBalance = user.wallet.balance;
    if (availableBalance < totalAmount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // 5. Lock the total amount
    user.wallet.balance -= totalAmount;
    user.wallet.lockedAmount += totalAmount;
    user.markModified("wallet");
    await user.save();

    // 6. Generate recurring payments
    const scheduledPayments = await Promise.all(
      billers.map((biller) => {
        const nextExecutionDate = calculateNextExecutionDate(
          startDate,
          frequency
        );

        return Payment.create({
          user: userId,
          recipientBiller: biller._id,
          amount: parseFloat(biller.serviceAmount),
          status: "Pending",
          transactionRef: `ATP-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
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
      message: "Recurring payments scheduled successfully.",
      payments: scheduledPayments,
    });
  } catch (error) {
    console.error("Recurring schedule error:", error);
    res.status(500).json({ message: "Failed to schedule recurring payments." });
  }
};

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

// redeem paycoin to wallet
const redeemPayCoin = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount provided." });
    }

    const numericAmount = Number(amount);

    if (numericAmount < 100) {
      return res
        .status(400)
        .json({ message: "Minimum redeemable amount is 100 PayCoins." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.wallet.payCoins < numericAmount) {
      return res.status(400).json({ message: "Insufficient PayCoins." });
    }

    // Deduct from payCoins and credit wallet
    user.wallet.payCoins -= numericAmount;
    user.wallet.balance += numericAmount;

    await user.save();

    res.status(200).json({ message: "Redeemed successfully." });
  } catch (error) {
    console.error("Redeem PayCoin Error:", error); // Add log for debugging
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

// cancel transaction
const deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;
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

    // Only allow cancellation if transaction is Pending
    if (transaction.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending transactions can be cancelled",
      });
    }

    // Refund locked amount to wallet
    const user = await User.findById(userId);
    user.wallet.balance += Number(transaction.amount);
    user.wallet.lockedAmount -= Number(transaction.amount);
    await user.save();

    // Update transaction status to Cancelled instead of deleting
    transaction.status = "Cancelled";
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction cancelled successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error cancelling transaction:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete transaction
// const deleteTransaction = async (req, res) => {
//   const { transactionId } = req.params;
//   console.log(req.params);
//   try {
//     const transaction = await Payment.findById(transactionId);

//     if (!transaction) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Transaction not found" });
//     }

//     const userId = req.userId; // Assumes user ID is attached to req via auth middleware
//     if (transaction.user.toString() !== userId) {
//       return res
//         .status(403)
//         .json({ success: false, message: "User not authorized" });
//     }

//     if (transaction.status === "Pending") {
//       const user = await User.findById(userId);

//       // Refund the locked amount to wallet
//       user.wallet.balance += transaction.amount;
//       user.wallet.lockedAmount -= transaction.amount;

//       await user.save(); // Save user changes
//     }

//     await transaction.deleteOne(); // or Payment.findByIdAndDelete(transactionId)

//     return res
//       .status(200)
//       .json({ success: true, message: "Transaction deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting transaction:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

module.exports = {
  fundWallet,
  p2PTransfer,
  flutterwaveWebhookHandler,
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
