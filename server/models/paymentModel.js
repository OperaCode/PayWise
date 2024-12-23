const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
 
  amount:{
    type: Number,
    required: true,
  },
  paymentMethod:{
    type: String,
    required: true, enum: ["Wallet", "Crypto"] 
  },
  description: {
    type: String,
    required: true,
  },
  users: [{ 
      type: mongoose.Schema.Types.ObjectId, ref: "User",required:true}],
  dueDate:{
    type: Date,
    required: true,
  },
  paymentstatus:{
    type: String,
    required: true, enum: ["Pending", "Successful", "Failed"]}
  
});
