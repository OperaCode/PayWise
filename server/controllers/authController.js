const { verifyUser } = require("../middleware/firebaseAdminAuth");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const admin = require("firebase-admin");
const User = require("../models/userModel");
const {
    sendVerificationEmail,
    sendWelcomeBackEmail,
  } = require("../config/registerEmailConfig.js");

/**
 * Handle Google Login
 */
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body; // Get token from frontend
    if (!idToken) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Verify Google ID token
    const user = await verifyUser(idToken);

    // Generate a JWT for session management
    const userJwt = jwt.sign(
      { uid: user.uid, email: user.email, name: user.name, picture: user.picture },
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({ success: true, token: userJwt, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "ID Token required" });

  try {
    // 🔹 Verify the Google ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken) {
      return res.status(401).json({ error: "Invalid ID Token" });
    }
    const { uid, email, name, picture } = decodedToken;


    console.log("🔍 Received request for /auth/me");


    if (!email) {
      return res.status(400).json({ error: "Google account email is required" });
    }

    

    // First, check if a user already exists by email
    let user = await User.findOne({ email });

    
    if (!user) {
      // 🔹 Create new user only if email doesn't exist
      user = await User.create({
        firebaseUID: uid,
        firstName: name?.split(" ")[0] || "",
        lastName: name?.split(" ").slice(1).join(" ") || "",
        email,
        profilePicture: picture,
        wallet: { balance: 100, cowries: 50, walletId: uid },
      });
    
    } 

    console.log(user)
    console.log("📧 Welcome email sent to new user:", email);
    await sendVerificationEmail(email, user.firstName); // Only send this
   
      // console.log(" Welcome back email sent to existing user:", email);
      // await sendWelcomeBackEmail(email, name); // Only for existing users
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400000), // 1 day
      sameSite: "none",
      secure: true,
    });

    // Send verification email
    // await sendVerificationEmail(user.email, user.firstName);

    res.status(200).json({
      message: `Authentication successful, Verification email sent`,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        wallet: user.wallet,
        token,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

module.exports = { googleLogin,googleAuth };
