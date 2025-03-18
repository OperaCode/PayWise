const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const protectUser = asyncHandler(async(req,res,next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer") || req.cookies.token) {
    try{
      token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id
      const foundUser = await userModel.findById(decoded.id).select("-password");
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
      }
      next();
    } catch(error){
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
    }
}
if (!token) {
  return res.status(401).json({ message: "Unauthorized, no token" });
}
})

module.exports = { protectUser };