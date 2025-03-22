const mongoose = require("mongoose");

const billerSchema = new mongoose.Schema(
  {
    profilePicture: { type: String, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    billerType: {
      type: String,
      enum: ["Vendor", "Beneficiary"], // Only two allowed categories
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["Electricity",
    "Water",
    "Internet",
    "Cable TV",
    "Other",],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link billers to users who add them
      required: true,
    },
    accountNumber: {
      type: String, // Could be a bank account or unique vendor ID
      required: true,
      unique: true,
    },
    bankName: {
      type: String, // Only relevant for beneficiaries
      default: null, // Ensure default value to avoid undefined errors
    },
    walletAddress: {
      type: String, // Only relevant for beneficiaries
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    dueDate: {
      type: Date, // Fixed incorrect "date" type
      default: null,
    },
    amount: {
      type: Number, // Fixed incorrect "number" type
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Biller", billerSchema);
