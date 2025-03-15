const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// const userSchema = new mongoose.Schema(
//   {
//     googleId: { type: String, unique: true, sparse: true },
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true, unique: true, index: true },
//     password: { type: String, required: function () { return !this.firebaseUID}},
//     profilePicture: { type: String, default: null }, // Store image URL
//     wallet: {
//       walletId: { type: String, default: () => crypto.randomUUID() },
//       balance: { type: Number,default: 0}, // Ensure new users get 100 tokens
//       cowries: { type: Number,default: 0}, // Ensure new users get 100 tokens
//     },
//     transactionPin: { type: String, required: false }, // Store hashed PIN
//     billers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Biller" }], // Reference Vendor model
//   },
//   { timestamps: true }
// );


// **Ensure wallet gets initialized properly**

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true }, // Google Auth users
    firebaseUID: { type: String, unique: true, sparse: true }, // Web3Auth users
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    wallet: {
      walletId: { type: String, default: () => crypto.randomUUID() },
      balance: { type: Number, default: 100 }, // Ensure new users get 100 tokens
      cowries: { type: Number, default: 100 },
    },
    transactionPin: { type: String, required: false },
    billers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Biller" }],
  },
  { timestamps: true }
);

// **Ensure wallet gets initialized properly**
userSchema.pre("save", function (next) {
  if (!this.wallet) {
    this.wallet = { walletId: crypto.randomUUID(), balance: 100, cowries: 100 };
  } else {
    if (this.wallet.balance === undefined) this.wallet.balance = 100;
    if (this.wallet.cowries === undefined) this.wallet.cowries = 100;
  }
  next();
});


userSchema.pre("save", function (next) {
  if (!this.wallet) {
    this.wallet = { walletId: crypto.randomUUID(), balance};
  } else if (!this.wallet.balance) {
    this.wallet.balance ; // Ensure balance is set
  }
  next();
});




module.exports = mongoose.model("User", userSchema);
