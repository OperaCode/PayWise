const mongoose = require("mongoose");

const billerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    billerType: {
      type: String,
      enum: ["vendor", "beneficiary"], // Only two allowed categories
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
    },
    serviceType: {
      type: String, // Only relevant for vendors (e.g., "Electricity", "Internet", "Water")
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Biller", billerSchema);
