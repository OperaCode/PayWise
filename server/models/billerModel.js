const mongoose = require("mongoose");

const billerSchema = new mongoose.Schema(
  {
    profilePicture: { type: String, default: null },
    name: { type: String, required: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    billerType: {
      type: String,
      enum: ["Vendor", "Beneficiary"], 
    },
    serviceType: {
      type: String,
      enum: ["Electricity", "Water", "Internet", "Cable TV"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    walletAddress: {
      type: String, // Only relevant for beneficiaries
      default: null,
    },
    amount: { type: Number, default: 0 }, 
    totalAmountPaid: { type: Number, default: 0 },  
    
    phone: {
      type: String,
      default: null,
    },
    dueDate: {
      type: Date, 
      default: null,
    },
    autoPayEnabled: {
      type: Boolean,
      default: false, 
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Biller", billerSchema);
