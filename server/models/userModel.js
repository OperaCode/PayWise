const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const beneficiarySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

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
    role: {
      type: String,
      default: "principal",
    },
    beneficiary: beneficiarySchema,
    balance: {
      type: Number,
      default: 0,
    },
    vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "vendors" }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
    updatedAt: {
      type: Date,
      default: null,
    },
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
