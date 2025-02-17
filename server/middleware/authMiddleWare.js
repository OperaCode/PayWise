const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

const protectUser = asyncHandler(async (req, res, next) => {
  // console.log("Headers Received: ", req.headers); // Debugging line
  let token;

  // Log Authorization header and cookies
  //console.log("Auth Header:", req.headers.authorization);
  //console.log("Cookies Token:", req.cookies?.token);

  token =
    req.headers?.authorization?.startsWith("Bearer") 
      ? req.headers.authorization.split(" ")[1] 
      : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    // Debugging: Decode token before verification
    const decodedRaw = jwt.decode(token);
    //console.log("Decoded Token:", decodedRaw);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Verified User ID:", decoded.id);

    if (!decoded.id) {
      return res.status(401).json({ message: "Unauthorized, invalid token payload" });
    }

    req.user = await UserModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);

    let errorMessage = "Unauthorized, invalid token";
    if (err.name === "TokenExpiredError") errorMessage = "Unauthorized, token expired";
    else if (err.name === "JsonWebTokenError") errorMessage = "Unauthorized, invalid token";

    return res.status(401).json({ message: errorMessage });
  }
});

module.exports = { protectUser };
