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
 
  status: {
    type: String,
    enum: ["Pending", "Successful", "Failed"],
    default: "pending",
  },
  transactionRef: { type: String, unique: true, required: true }, // Unique reference for tracking
  isRecurring: { type: Boolean, default: false },
  // method:{type: Number, enum: ["wallet", "rewards"], require:true},
  nextExecution: { type: Date },
  isAutoPayment: { type: Boolean, default: false },
  frequency: { type: String, enum: ["once", "daily", "weekly", "monthly"] },
  paymentType: {
    type: String,
    enum: ['Autopay', 'Scheduled','Transfer', 'Funding'],
    default: 'Scheduled',
  },
  
  // startDate: { type: Date,  default: Date.now },

  scheduleDate: { type: Date },
  paidAt: Date,
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
