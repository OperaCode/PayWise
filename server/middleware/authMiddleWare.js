
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

// Middleware to protect user routes by verifying JWT token
const protectUser = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token is available in the Authorization header or cookies
  if (
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) ||
    req.cookies.token // Optional: Token stored in cookies (useful for development)
  ) {
    try {
      // Extract the token from the Authorization header or cookies
      token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;

      if (!token) {
        return res.status(403).json({ message: "Unauthorized, no token provided" });
      }

      // Verify the token using the secret from environment variables
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

      // Attach the user ID from the token to the request object
      req.userId = decoded.id;

      // Fetch the user from the database and exclude the password field
      const foundUser = await UserModel.findById(decoded.id).select("-password");

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
      }

      // Continue to the next middleware or route handler
      next();
    } catch (err) {
      // Handle specific JWT errors for better user feedback
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized, token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Unauthorized, invalid token" });
      }

      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle missing token scenario
    res.status(403).json({ message: "Unauthorized, no token provided" });
  }
});

module.exports = { protectUser };
