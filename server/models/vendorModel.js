const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please add an email"],
  },
  category: {
    type: String,
    required: true, enum: ["Merchant", "Beneficiary"] 
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    default: null,
  },
  paymentDetails: {
    accountNumber: { type: String },
    walletAddress: { type: String },
  },
  users: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
});

module.exports = mongoose.model("Vendor", vendorSchema);