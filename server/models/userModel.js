const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uuid = require("uuid");




const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Wallet Details
  walletId: { type: String, unique: true, default: uuid }, // Unique wallet address
  balance: { type: Number, default: 0 },
  notifications: [
    {
      message: String,
      type: { type: String, enum: ["success", "error", "info"], required: true },
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    }
  ],
   
    
    reminderPreference: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
