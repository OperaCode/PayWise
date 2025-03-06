const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null }, // Store image URL
    wallet: {
      walletId: { type: String, default: () => crypto.randomUUID() },
      balance: { type: Number,default: 0}, // Ensure new users get 100 tokens
      cowries: { type: Number,default: 0}, // Ensure new users get 100 tokens
    },
    transactionPin: { type: String, required: false }, // Store hashed PIN
    billers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Biller" }], // Reference Vendor model
  },
  { timestamps: true }
);


// **Ensure wallet gets initialized properly**
userSchema.pre("save", function (next) {
  if (!this.wallet) {
    this.wallet = { walletId: crypto.randomUUID(), balance};
  } else if (!this.wallet.balance) {
    this.wallet.balance ; // Ensure balance is set
  }
  next();
});


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
);

module.exports = mongoose.model("User", userSchema);
