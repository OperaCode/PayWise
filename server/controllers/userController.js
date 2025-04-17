const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const { userUpload, cloudinary } = require("../config/cloudConfig.js"); // Multer middleware for file uploads
const {
  sendVerificationEmail,
  sendWelcomeBackEmail,
  sendMetaMaskEmail,
} = require("../config/EmailConfig.js");

// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");

// const admin = require("../middleware/firebaseAdminAuth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Initialize Google client

// GOOGLE_CLIENT_ID="345493382219-9ancu2on81977erh7re38brdjo11qj43.apps.googleusercontent.com"
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { firstName, lastName, email, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password length
    if (password.length < 8 || password.length > 12) {
      return res
        .status(400)
        .json({ message: "Password must be between 8 and 12 characters" });
    }

    // Check if user already exists
    const userExist = await userModel.findOne({ email });
    console.log("Existing user check result:", userExist);

    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }

    // Create user with wallet
    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password,
      wallet: {
        balance: 0,
        paycoin: 0,
        walletId: uuidv4(),
      },
      isVerified: false, // New users are NOT verified initially
      verificationToken: jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      }),
    });

    // Generate verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${newUser.verificationToken}`;
    console.log("Sending verification email to:", newUser.email);
    // Send verification email
    await sendVerificationEmail(newUser.email, firstName, verificationLink);

    await newUser.save(); // Save user before sending response

    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400000),
      sameSite: "none",
      secure: true,
    });

    console.log("User registered successfully:", newUser.email);

    res.status(201).json({
      message: `Registration Successful! A verification email has been sent.`,
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        wallet: {
          balance: newUser.wallet.balance,
          paycoin: newUser.wallet.paycoin,
          walletId: newUser.wallet.walletId,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// EMAIL LOGIN TRAILS WITH FIREBASE
// const loginUser2 = asyncHandler(async (req, res) => {
//   try {
//     const { idToken } = req.body; // ✅ Expect an ID Token from Firebase

//     if (!idToken) {
//       return res.status(400).json({ message: "Firebase ID token is required" });
//     }

//     // ✅ Verify Firebase token
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const email = decodedToken.email;

//     console.log("Decoded Token:", decodedToken);

//     // ✅ Find user in MongoDB
//     const user = await userModel.findOne({ email });
//     console.log("✅ Searching for user with email:", email);
//     console.log("🔍 Found user:", user);

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     // ✅ Generate JWT for app authentication
//     const token = generateToken(user._id);

//     res.cookie("token", token, {
//       httpOnly: true,
//       expires: new Date(Date.now() + 86400000),
//       sameSite: "none",
//       secure: true,
//     });

//     res.status(200).json({
//       _id: user._id,
//       firstName: user.firstName,
//       email,
//       token,
//       wallet: user.wallet || { balance: 0, walletId: null },
//     });
//   } catch (error) {
//     console.error("🔥 Firebase Auth Error:", error);
//     res.status(500).json({ message: "Authentication Failed" });
//   }
// });

const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "Invalid token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    // to restrict unverififed users
    // if (!user.isVerified) {
    //   return res.status(403).json({ message: "Please verify your email before logging in." });
    // }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    await sendWelcomeBackEmail(user.email, user.firstName);
    console.log("welocm e email sent")

    // Generate token
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // Expires in 24 hours
      sameSite: "none",
      secure: true,
    });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        wallet: user.wallet,
        token, // Only send if using local storage (not recommended for security)
      },
    });

  

    console.log(user);
  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const connectWallet = asyncHandler(async (req, res) => {
  const { userId, walletAddress } = req.body;

  if (!userId || !walletAddress) {
    return res
      .status(400)
      .json({ message: "User ID and wallet address are required" });
  }

  try {
    // Ensure no other user has this wallet address before updating
    const existingUser = await User.findOne({ metamaskWallet: walletAddress });

    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "This MetaMask wallet address is already in use." });
    }

    // Find the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is linking their wallet for the first time
    const firstTimeLinked = !user.metamaskWallet;

    // If first time linking, apply reward logic
    let rewardAmount = 0;
    if (firstTimeLinked) {
      // Reward logic: You can customize this reward calculation
      rewardAmount = 5; // Example: $50 reward for linking the wallet
      // Add the reward to the user's balance (assuming a `balance` field exists in the user schema)
      user.wallet.payCoins += rewardAmount;
      await user.save();
    }

    // Update the user's wallet address
    user.metamaskWallet = walletAddress;
    await user.save();


    // Respond with success
    res.status(200).json({
      message: "MetaMask wallet connected successfully",
      user,
      firstTimeLinked,
      updatedWallets: user.metamaskWallet,
      rewardAmount, 
    });
  } catch (error) {
    console.log("Error updating wallet:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});



const setTransactionPin = asyncHandler(async (req, res) => {
  try {
    const { pin } = req.body;
    const userId = req.userId; // Extracted from token

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Validate PIN format
    if (!pin || typeof pin !== "string" || pin.length !== 4 || isNaN(pin)) {
      return res.status(400).json({ message: "Invalid PIN format. Must be a 4-digit number." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the PIN before saving
    const hashedPin = await bcrypt.hash(pin, 10);
    console.log("Hashed transaction PIN:", hashedPin);
    user.transactionPin = hashedPin;
    await user.save();

    return res.status(200).json({ message: "Transaction PIN set successfully." });
  } catch (error) {
    console.error("Error setting transaction PIN:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});


const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, no user ID" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "Users", // Ensure this folder exists in Cloudinary
    });

    console.log("Cloudinary Image URL:", uploadedImage.secure_url); // Debugging log

    // Update the user in MongoDB with the Cloudinary URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadedImage.secure_url }, // Store the image URL
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile picture updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUser = asyncHandler(async (req, res) => {
  try {
    // Extract user ID from request (set by auth middleware)
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No userId found" });
    }

    // Find user in database
    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Fetch User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await userModel.find().sort("-createAt").select("-password");

    if (!users) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// incomplete
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields dynamically
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("user not found");
    }
    await user.deleteOne();
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errorMessage: err.message });
  }
});

// function to log out user
const LogoutUser = asyncHandler(async (req, res) => {
  try {
    await axios.get("http://localhost:3000/user/logout", {
      withCredentials: true,
    });

    // ✅ Clear local storage or session storage
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // If stored separately

    // ✅ Redirect to login page
    navigate("/login");
    toast.success("Logged out successfully!");
  } catch (error) {
    toast.error("Logout failed");
    console.error("Logout Error:", error);
  }
});

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  uploadProfilePicture,
  connectWallet,
  setTransactionPin,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  LogoutUser,
};
