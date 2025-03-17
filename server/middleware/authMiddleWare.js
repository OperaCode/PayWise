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

  console.log("🔍 Request Headers:", req.headers);

 // Extract token from Authorization header, cookies, or request body
if (req.headers.authorization?.startsWith("Bearer ")) {
  token = req.headers.authorization.split(" ")[1];
} else if (req.cookies?.token) {
  token = req.cookies.token;
} else if (req.body?.idToken) {  // ✅ Add this check
  token = req.body.idToken;
}

  // No token found, reject request
  if (!token) {
    console.log("❌ No token found.");
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Decoded Firebase Token:", decodedToken);

    // Check if decodedToken contains 'uid' (Ensures it's a Firebase ID token)
    if (!decodedToken.uid) {
      throw new Error("Invalid Firebase ID token");
    }

    // Fetch user from MongoDB using Firebase UID
    const foundUser = await userModel.findOne({ firebaseUID: decodedToken.uid }).select("-password");

    if (!foundUser) {
      console.log("❌ User not found in database.");
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = foundUser;
    req.userId = foundUser.id;

    next();
  } catch (error) {
    console.error("❌ Firebase Token Verification Error:", error.message);
    
    let errorMessage = "Unauthorized, invalid token";
    if (error.code === "auth/id-token-expired") {
      errorMessage = "Session expired. Please log in again.";
    } else if (error.code === "auth/argument-error") {
      errorMessage = "Invalid token provided.";
    }

    return res.status(401).json({ message: errorMessage });
  }
});

module.exports = { protectUser };
