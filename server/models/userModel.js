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
    password: { 
      type: String, 
      required: function () { return !this.googleId && !this.firebaseUID; } // Password required only if NOT Google/Web3
    },
    profilePicture: { type: String, default: null },
    wallet: {
      walletId: { type: String, default: () => crypto.randomUUID() },
      balance: { type: Number, default: 100 }, // Ensure new users get 100 tokens
      cowries: { type: Number, default: 100 },
    },
    metamaskWallet: { type: String, unique: true, default: null}, // MetaMask Wallet Address
    transactionPin: { type: String, required: false },
    billers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Biller" }],
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next){
  if(!this.isModified("password")){
    return next();
  }

  // hashing of password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  next();

});





const User = mongoose.model("User", userSchema)
module.exports = User
