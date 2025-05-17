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
  //frequency: { type: String, enum: ["daily", "weekly", "monthly"] },
  status: {
    type: String,
    enum: ["Pending", "Successful", "Failed", "Cancelled"],
    default: "Pending",
  },
  transactionRef: { type: String, unique: true, required: true }, // Unique reference for tracking


isRecurring: { type: Boolean, default: false },
  // method:{type: Number, enum: ["wallet", "rewards"], require:true},

  frequency: { type: String, enum: ["once", "daily", "weekly", "monthly"] },
  isAutoPayment: { type: Boolean, default: false },

  scheduleDate: { type: Date },
  nextExecution: { type: Date },
  paidAt: Date,
  paymentType: {
    type: String,
    enum: ['Autopay', 'Scheduled','Transfer', 'Funding','withdrawal'],
    default: 'Scheduled',
  },
  recurrence: {
    occurrencesLeft: { type: Number, default: null }, // optional
    lastPaidAt: { type: Date }
  },
    
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
