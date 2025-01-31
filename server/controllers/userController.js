
const UserModel = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

//to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });
};


const registerUser = asyncHandler(async(req, res)=>{
 try {
  const {firstName, lastName, email, password} = req.body;

  if(!firstName || !lastName || !email || !password){
    res.status(403);
    throw new Error("All Fields are required")
  }else if(password.length < 8){
    res.status(403);
    throw new error("Password must be at least 8 characters");
 } 

 userExist = await UserModel.findOne({ email});
 if(userExist){
  res.status(400).json({message: "User already exists"});
 }

// to create a new user in the database
const user = await UserModel.create({ fullname, email, password });

// to generate a token for the user
const token = generateToken(user._id);

res.cookie("token", token, {
  path: "/",
  httpOnly: true,
  expires: new Date(Date.now() + 1000 + 86400),
  sameSite: "none",
  secure: true,
});

 // send a success response with the user details and token
 if (user) {
  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
}

}catch (error) {
  console.log(error);
 }});

const loginUser = asyncHandler(async(req, res)=>{
try {
  const {email, password} = req.body;
const user = await userModel.findOne({email});

if(!user) {
  res.status(401).json({message: 'User not found'})
}
// to check if password match
const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
  return res.status(404).json({ message: "Invalid Credentials" });
}

const token = generateToken(user._id);
res.cookie("token", token, {
  path: "/",
  httpOnly: true,
  expires: new Date(Date.now() + 1000 + 86400),
  sameSite: "none",
  secure: true,
});

const { _id, fullname, role } = user;
    res.status(201).json({ _id, fullname, email, role, token });

} catch (error) {
  console.error(error);
}
});

const getUser =asyncHandler(async(req, res)=>{
try {
  const {userId} =  req.params;
const user = await UserModel.findOne({userId});
if (user) {
  const { _id, fullname, email} = user;
  res.status(200).json({ _id, fullname, email});
} else {
  res.status(404).json({ message: "User Not Found" });
}
console.error(err);
    res.status(500).send("Internal Server Error");



} catch (error) {
  console.log(error);
}
});

const getBeneficiaries = asyncHandler(async (req, res) => {
  try {
    const beneficiaries = await UserModel.find()
      .sort("-createAt")
     // .select("-password");

    if (!beneficiaries) {
      return res.status(404).json({ message: "No beneficiaries found" });
    }
    res.status(200).json(beneficiaries);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
});


 module.exports = {registerUser,loginUser,getUser,getBeneficiaries}