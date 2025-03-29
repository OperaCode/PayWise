const mongoose = require("mongoose");

const billerSchema = new mongoose.Schema(
  {
    profilePicture: { type: String, default: null },
    name: { type: String, required: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    billerType: {
      type: String,
      enum: ["Vendor", "Beneficiary"], // Only two allowed categories
      //required: true,
    },
    serviceType: {
      type: String,
      enum: ["Electricity", "Water", "Internet", "Cable TV", "Other"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link billers to users who add them
      required: true,
    },

    walletAddress: {
      type: String, // Only relevant for beneficiaries
      default: null,
    },
    amount: { type: Number, default: 0 }, 
    totalPayment: { type: Number, default: 0 }, 
    // accountNumber: {
    //   type: String,
    //   unique: true,  // This makes it a unique field
    //   sparse: true,  // Allows multiple null values (FIX!)
    // },
    phone: {
      type: String,
      default: null,
    },
    dueDate: {
      type: Date, // Fixed incorrect "date" type
      default: null,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Biller", billerSchema);
