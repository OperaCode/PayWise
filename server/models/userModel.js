const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// Define the Notification Schema

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    wallet: {
      walletId: { type: String, unique: true, required: true, default: uuidv4 },
      balance: { type: Number, default: 0 },
    },
    biller: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor", enum:"Vendor,biller" }], // Array of vendor IDs
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  next();
});

module.exports = mongoose.model("User", userSchema);
