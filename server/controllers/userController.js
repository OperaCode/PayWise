const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const {
  sendVerificationEmail,
  sendWelcomeBackEmail,
} = require("../config/registerEmailConfig.js");


const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// const admin = require("../middleware/firebaseAdminAuth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Initialize Google client

// GOOGLE_CLIENT_ID="345493382219-9ancu2on81977erh7re38brdjo11qj43.apps.googleusercontent.com"
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for Local Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

//REGISTER USER WITH FORMDATA
// const registerUser = asyncHandler(async (req, res) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;

//     if (!firstName || !lastName || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (password.length < 8 || password.length > 20) {
//       return res
//         .status(400)
//         .json({ message: "Password must be between 8 and 20 characters" });
//     }

//     const userExist = await userModel.findOne({ email });
//     if (userExist) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     //Hash password before saving
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create a new user with a transaction wallet
//     const newUser = await userModel.create({
//       firstName,
//       lastName,
//       email,
//       password,
//       wallet: {
//         balance: 100,
//         cowries: 50,
//         walletId: uuidv4(),
//       },
//     });

//     if (newUser) {
//       // Generate a token for the user
//       const token = generateToken(newUser._id);

//       res.cookie("token", token, {
//         path: "/",
//         httpOnly: true,
//         expires: new Date(Date.now() + 86400000), // 1 day
//         sameSite: "none",
//         secure: true,
//       });

//       res.status(201).json({
//         message: "User registered successfully",
//         user: {
//           _id: newUser._id,
//           firstName: newUser.firstName,
//           lastName: newUser.lastName,
//           email: newUser.email,
//           wallet: {
//             balance: newUser.wallet.balance,
//             cowries: newUser.wallet.cowries,
//             walletId: newUser.wallet.walletId,
//           },
//           token,
//         },
//       });
//     } else {
//       res.status(400).json({ message: "User registration failed" });
//     }
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { idToken, firstName, lastName, email, password, confirmPassword} = req.body;

    console.log("idToken:", idToken);
    console.log("email:", email);
    // console.log("password:", password);
    console.log("firstName:", firstName);
    console.log("lastName:", lastName);

    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!idToken) {
      console.warn("⚠️ Missing idToken (if required for Firebase authentication)");
    }

    // Validate password length
    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({ message: "Password must be between 8 and 20 characters" });
    }

    // Check if user already exists
    const userExist = await userModel.findOne({ email });
    console.log("Existing user check result:", userExist);

    if (userExist) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    // Hash password BEFORE saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with wallet
    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword, 
      wallet: {
        balance: 100,
        cowries: 50,
        walletId: uuidv4(),
      },
    });
    
    if (!newUser) {
      return res.status(400).json({ message: "User registration failed" });
    }

    
    await sendVerificationEmail(newUser.email, newUser.firstName);

  
    const token = generateToken(newUser._id);
    
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400000), 
      sameSite: "none",
      secure: true,
    });
    console.log(newUser)
    

    console.log("User registered successfully:", newUser.email);

    res.status(201).json({
      message: `Registration Successful. Verification email sent!`,
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        wallet: {
          balance: newUser.wallet.balance,
          cowries: newUser.wallet.cowries,
          walletId: newUser.wallet.walletId,
        },
        token,
      },
    });
    console.log(newUser)

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


// const loginUser1 = asyncHandler(async (req, res) => {
//   try {
//     const {email, password} = req.body;
//     let user = await User.findOne({email})

//     // Check if the admin exists
//     if(!user) {
//         return res.status(404).json({message: 'User Not Found!'})
//     }
//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if(!isMatch) {
//         return res.status(400).json({message: 'Invalid Credentials'})
//     }

//     const token = generateToken(user._id);
//     res.cookie('token', token, {
//         path: '/',
//         httpOnly: true,
//         expires: new Date(Date.now() + 1000 * 86400),   //expires within 24hrs
//         sameSite: 'none',
//         secure: true
//     })

//     const {_id, firstName, lastName} = user;
//     res.status(201).json({_id, firstName, lastName, email, token})
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal Server Error" });
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

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
    console.log(user)
  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



const setTransactionPin = asyncHandler(async (req, res) => {
  try {
    const { userId, pin } = req.body;

    // Validate input
    if (!userId || !pin || pin.length !== 4) {
      return res
        .status(400)
        .json({ message: "Invalid PIN format. Must be 4 digits." });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    await User.findByIdAndUpdate(userId, { transactionPin: hashedPin });

    return res
      .status(200)
      .json({ message: "Transaction PIN set successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

const uploadProfilePicture = asyncHandler(async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
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
});


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
  loginUser,
  uploadProfilePicture,
  setTransactionPin,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  LogoutUser,
};
