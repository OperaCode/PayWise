const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const protectUser = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header or cookies
  if (
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) ||
    req.cookies.token
  ) {
    try {
      // Extract token from header or cookies
      token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from database
      const foundUser = await userModel.findById(decoded.id).select("-password");

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
      }

      // Attach user to request object
      req.user = foundUser;
      req.userId = foundUser.id; // Ensure consistency

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized, no token" });
  }
});

module.exports = { protectUser };
