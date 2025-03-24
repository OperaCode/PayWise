const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const protectUser = asyncHandler(async(req,res,next) => {
  let token;
 
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    //console.error("No token found in request.");
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    
    //console.log("🔹 Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

  
    //console.log("🔹 Fetching user from DB...");
    const foundUser = await userModel.findById(req.userId).select("-password");

    if (!foundUser) {
      console.warn("⚠️ User not found.");
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    //console.log("Authentication successful for user:", foundUser.email);
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
})

module.exports = { protectUser };

// Example of basic auth middleware
// const authMiddleware = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     // Verify the token and decode user info
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Add the user object to the request
//     req.user = decoded;
    
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };