const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");


const protectUser = asyncHandler(async(req, res, next)=>{
  
})