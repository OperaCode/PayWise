

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")





const transferFunds = asyncHandler(async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;
  
    // Validate request data
    if (!senderId || !receiverId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid transfer request" });
    }
  
    // Find sender
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
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









module.exports = { transferFunds};