const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
fullName:{
  type:String,
  required:true,
},
email:{
  type:String,
  required:[true, "Please add an email"],
},
category:{
  type:String,
  required:true,
},
payment:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Payment",
  default: null
},


});