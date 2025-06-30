const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const { userUpload, cloudinary } = require("../config/cloudConfig.js"); // Multer middleware for file uploads
// const {
//   sendVerificationEmail,
//   sendWelcomeBackEmail,
//   sendMetaMaskEmail,
// } = require("../config/EmailConfig.js");

// const {
//   sendRegistrationEmail,
//   sendSignInEmail,
//   sendBillerAddedEmail,
// } = require("../config/ResendEmail.js");

const { sendWelcomeEmail, sendSignInEmail } = require("../config/email.js");





const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};



const registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("Incoming request body:", req.body);

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

 
    if (password.length < 8 || password.length > 12) {
      return res
        .status(400)
        .json({ message: "Password must be between 8 and 12 characters" });
    }

   
    const userExist = await userModel.findOne({ email });
    console.log("Existing user check result:", userExist);

    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }


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
     
    });

   
    await newUser.save(); 
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
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// EMAIL LOGIN  WITH FIREBASE
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

// const verifyEmail = asyncHandler(async (req, res) => {
//   try {
//     const { token } = req.query;

//     if (!token) return res.status(400).json({ message: "Invalid token" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.isVerified = true;
//     await user.save();

//     res.json({ message: "Email verified successfully!" });
//   } catch (error) {
//     res.status(400).json({ message: "Invalid or expired token" });
//   }
// });

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

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
      return res
        .status(400)
        .json({ message: "Invalid PIN format. Must be a 4-digit number." });
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

    return res
      .status(200)
      .json({ message: "Transaction PIN set successfully." });
  } catch (error) {
    console.error("Error setting transaction PIN:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

// const uploadProfilePicture = async (req, res) => {
//   try {
//     const userId = req.userId; 
//     console.log(userId)
//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized, no user ID" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Upload to Cloudinary
//     const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
//       folder: "Users", 
//     });

//     console.log("Cloudinary Image URL:", uploadedImage.secure_url); // Debugging log
//     console.log("Searching userId:", userId);
//     // Update the user in MongoDB with the Cloudinary URL
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePicture: uploadedImage.secure_url }, // Store the image URL
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "Profile picture updated", user: updatedUser });
//   } catch (error) {
//     console.error("Error updating profile picture:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;

    console.log("🧩 [Auth] Received userId:", userId);

    if (!userId) {
      console.warn("❌ No user ID found in request");
      return res.status(401).json({ message: "Unauthorized, no user ID" });
    }

    if (!req.file) {
      console.warn("❌ No file attached in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📤 Uploading image to Cloudinary...");
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "Users",
    });

    console.log("✅ [Cloudinary] Uploaded Image URL:", uploadedImage.secure_url);

    console.log("🔍 Searching for user in DB with ID:", userId);
    const userBefore = await User.findById(userId);

    if (!userBefore) {
      console.error("No user found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("📝 Updating user profile with new image URL...");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadedImage.secure_url },
      { new: true }
    );

    console.log("✅ [MongoDB] User updated successfully");

    res.status(200).json({ message: "Profile picture updated", user: updatedUser });
  } catch (error) {
    console.error("💥 Error during profile picture update:", error);
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

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.userId; // coming from auth middleware
  const { currentPassword, newPassword, currentPin, newPin, ...rest } =
    req.body;

  const allowedFields = ["firstName", "lastName", "email"];

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Password update
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password required" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }

    // Transaction PIN update
    if (newPin) {
      if (!currentPin) {
        return res.status(400).json({ message: "Current PIN required" });
      }
      const isMatch = await bcrypt.compare(
        currentPin,
        user.transactionPin || ""
      );
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current PIN" });
      }
      const hashedPin = await bcrypt.hash(newPin, 10);
      user.transactionPin = hashedPin;
    }

    // Apply updates to allowed fields only
    for (let key of Object.keys(rest)) {
      if (allowedFields.includes(key)) {
        user[key] = rest[key];
      }
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Internal server error" });
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
const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  // verifyEmail,
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
