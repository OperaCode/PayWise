const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const admin = require("firebase-admin");

// Ensure Firebase Admin SDK is initialized
if (!admin.apps.length) {
  const serviceAccount = require("../utils/firebaseAdmin.json"); // Replace with actual path
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const protectUser = asyncHandler(async (req, res, next) => {
  let token;

  console.log("Request Headers:", req.headers);

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Extract token
  } else if (req.cookies?.token) {
    token = req.cookies.token; // Use token from cookies if available
  }

  if (!token) {
    console.log("No token found.");
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Decoded Firebase Token:", decodedToken);

    // Fetch user from MongoDB using Firebase UID
    const foundUser = await userModel.findOne({ firebaseUID: decodedToken.uid }).select("-password");

    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = foundUser;
    req.userId = foundUser.id;

    next();
  } catch (error) {
    console.error("Firebase Token Verification Error:", error.message);
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
});

module.exports = { protectUser };
