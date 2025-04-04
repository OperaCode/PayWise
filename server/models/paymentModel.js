const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientBiller: { type: mongoose.Schema.Types.ObjectId, ref: 'Biller' },
  amount: {
    type: Number,
    required: true,
    min: [0.01, "Amount must be greater than 0"],
  },
  frequency: { type: String, enum: ["daily", "weekly", "monthly"] },
  status: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending",
  },
  transactionRef: { type: String, unique: true, required: true }, // Unique reference for tracking
  isRecurring: { type: Boolean, default: false },
  // method:{type: Number, enum: ["wallet", "rewards"], require:true},
  nextExecution: { type: Date },
  
  // startDate: { type: Date,  default: Date.now },

  scheduleDate: { type: Date, default: Date.now   },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
