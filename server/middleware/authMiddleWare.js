const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

// Middleware to protect user routes by verifying JWT token
const protectUser = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header or cookies
  token =
    req.headers?.authorization?.startsWith("Bearer") 
      ? req.headers.authorization.split(" ")[1] 
      : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure decoded has a valid user ID
    if (!decoded.id) {
      return res.status(401).json({ message: "Unauthorized, invalid token payload" });
    }

    // Fetch user and attach it to `req.user`
    req.user = await UserModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    next(); // Proceed to next middleware
  } catch (err) {
    let errorMessage = "Unauthorized, invalid token";

    if (err.name === "TokenExpiredError") {
      errorMessage = "Unauthorized, token expired";
    } else if (err.name === "JsonWebTokenError") {
      errorMessage = "Unauthorized, invalid token";
    }

    return res.status(401).json({ message: errorMessage });
  }
});

module.exports = { protectUser };
