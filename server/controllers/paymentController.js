

const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userModel")
const Payment = require("../models/paymentModel")
const bcrypt = require("bcrypt")




const transferFunds = asyncHandler(async (req, res) => {
  try {
    const { senderEmail, receiverEmail, amount, method, pin } = req.body;

    // Validate request data
    if (!senderEmail || !receiverEmail || !amount || amount <= 0 || !method) {
        return res.status(400).json({ message: "Invalid transfer request" });
    }

    if (!["wallet", "rewards"].includes(method)) {
        return res.status(400).json({ message: "Invalid payment method. Choose 'wallet' or 'rewards'." });
    }

    // Start a transaction session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch sender and receiver within the transaction session
        const sender = await User.findOne({ email: senderEmail }).session(session);
        const receiver = await User.findOne({ email: receiverEmail }).session(session);

        if (!sender) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Sender not found" });
        }
        if (!receiver) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Receiver not found" });
        }

        // Ensure sender has set a transaction PIN
        if (!sender.transactionPin) {
            await session.abortTransaction();
            return res.status(400).json({ message: "You must set a transaction PIN before making transfers." });
        }

        // Validate transaction PIN
        const isPinValid = await bcrypt.compare(pin, sender.transactionPin || "");
        if (!isPinValid) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Invalid transaction PIN" });
        }

        // Validate balance before deducting
        if (method === "wallet") {
            if (sender.wallet.balance < amount) {
                await session.abortTransaction();
                return res.status(400).json({ message: "Insufficient wallet balance" });
            }
            sender.wallet.balance -= amount; // Deduct amount
        } else if (method === "rewards") {
            if (sender.wallet.rewards < amount) {
                await session.abortTransaction();
                return res.status(400).json({ message: "Insufficient rewards balance" });
            }
            sender.wallet.rewards -= amount;
        }

        // Update sender's balance
        await sender.save({ session });

        // Increment receiver's balance using `$inc`
        await User.updateOne(
            { email: receiverEmail },
            { $inc: { "wallet.balance": amount } },
            { session }
        );

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

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
        await session.abortTransaction();
        session.endSession();
        console.error("Transfer Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
} catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
}




});

const recurringTransfer = asyncHandler(async(req,res)=>{
  try {
    const { user, biller, amount} = req.body;
    //const { senderId, receiverId, amount, pin } = req.body;
    

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
        RecurringPayment: {
            frequency,
            nextExecution,
            status: "active",
        },
        isRecurring: true,
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