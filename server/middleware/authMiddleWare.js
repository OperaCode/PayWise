const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectUser = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]; // Extract token
    }

    console.log("🔹 Token received in middleware:", token); // Debugging log

    if (!token) {
      console.log("🔴 No token found in request headers.");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded token:", decoded);

    // Find user from token
    req.user = await User.findById(decoded.id).select("-password");
    console.log("🔹 User found in database:", req.user);

    if (!req.user) {
      console.log("🔴 No user found with this token ID.");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    next(); // Continue to the next middleware
  } catch (error) {
    console.error("🔴 Authentication error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = { protectUser };
