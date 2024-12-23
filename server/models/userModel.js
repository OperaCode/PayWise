const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const fullNameSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
    required:true,
  },
  
});


const userScehma = new mongoose.Schema({
  fullname:fullNameSchema,
  email:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    default: "principal"
  },
  balance:{
    type:Number,
    default: 0,
  },
  vendors:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    default: [{}]
  },
  payments:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    default: [{}]
  },
  updatedAt:{
    type:Date,
    default:null,
  },

},{timestamps:true});

userScehma.pre("save", async function(next){
if(!this.isModified("password")){
  return next();
}
const salt= await bcrypt.genSalt(8)
this.password=await bcrypt.hash(this.password,salt)
next();
});

const User = mongoose.model("User",userSchema);
module.exports = User;