const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");

const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const admin = require("../middleware/firebaseAdminAuth");

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

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({ message: "Password must be between 8 and 20 characters" });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with a transaction wallet
    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password,
      wallet: {
        balance: 100,
        rewards: 50,
        walletId: uuidv4(),
      },
      
    });

    if (newUser) {
      // Generate a token for the user
      const token = generateToken(newUser._id);

      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 86400000), // 1 day
        sameSite: "none",
        secure: true,
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          walletId: newUser.wallet.walletId,
          balance: newUser.wallet.balance,
          rewards: newUser.wallet.rewards,
          token,
        },
      });
    } else {
      res.status(400).json({ message: "User registration failed" });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    const user = await userModel.findOne({ email });
    // console.log(user)
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials, user not found" });
    }
  
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.error("Password mismatch detected:", { inputPassword: password, storedPassword: user.password });
      return res.status(401).json({ message: "Password mismatch detected" });
    }
  
    // Ensure user has a wallet (prevents balance reset issues)
    if (!user.wallet) {
      user.wallet = { balance: 0, walletId: generateWalletId() }; // Ensure wallet exists
      await user.save();
    }
  
    // Generate JWT token
    const token = generateToken(user._id);
  
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400000), // 1 day
      sameSite: "none",
      secure: true,
    });
  
    //console.log("Wallet before login response:", user.wallet.balance); // Debugging
  
    res.status(200).json({
      _id: user._id,
      firstName:user.firstName,
      lastname:user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      email,
      token,
      wallet: {
        walletId: user.wallet.walletId || null,
        balance: user.wallet.balance ?? 0, // Ensure a default balance
        rewards: user.wallet.rewards ?? 0, // Ensure a default balance
      },
    });
  
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
});

const googleSignUp = asyncHandler(async(req, res)=>{


const { firebaseUID, email, name, profilePicture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Split name into first and last name (Google only provides full name)
      const nameParts = name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      // Create new user with wallet
      user = await User.create({
        firebaseUID,
        firstName,
        lastName,
        email,
        profilePicture,
        wallet: {
          balance: 100,
          rewards: 50,
          walletId: uuidv4(),
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set authentication cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400000), // 1 day
      sameSite: "none",
      secure: true,
    });

    res.status(201).json({
      message: "User authenticated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        walletId: user.wallet.walletId,
        balance: user.wallet.balance,
        rewards: user.wallet.rewards,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

const googleSignIn =asyncHandler(async(req, res)=>{
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user exists, otherwise create a new user
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name, provider: "google" });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Google login failed, please try again" });
  }
});


const setTransactionPin = asyncHandler(async(req,res)=>{
  try {
    const { userId, pin } = req.body;

    // Validate input
    if (!userId || !pin || pin.length !== 4) {
      return res.status(400).json({ message: "Invalid PIN format. Must be 4 digits." });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    await User.findByIdAndUpdate(userId, { transactionPin: hashedPin });

    return res.status(200).json({ message: "Transaction PIN set successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});


// const uploadProfilePicture= asyncHandler(async (req,res)=>{
//   try {
//     const { userId } = req.body;
//     if (!userId) return res.status(400).json({ error: "User ID is required" });

//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     // ✅ Upload image to Cloudinary
//     const result = await cloudinary.v2.uploader.upload_stream(
//       { folder: "profile_pictures", resource_type: "image" },
//       async (error, result) => {
//         if (error) return res.status(500).json({ error: "Cloudinary upload failed" });

//         // ✅ Update user's profile picture in MongoDB
//         const updatedUser = await User.findByIdAndUpdate(
//           userId,
//           { profilePicture: result.secure_url },
//           { new: true }
//         );

//         res.json({ message: "Upload successful", profilePicture: result.secure_url, user: updatedUser });
//       }
//     );

//     result.end(req.file.buffer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

const getUser = asyncHandler(async (req, res) => {
  // try {
  //   const userId = req.userId;  // Get ID from authenticated user
  //   const user = await User.findById(userId);
    
  //   if(!user) {
  //     return res.status(404).json({message: 'User Not Found!'})
  //   }
    
 
  //   return res.status(200).json({user});
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({message: 'Internal Server Error'})
  // }

  // try {
  //   const token = localStorage.getItem('token'); // Retrieve the token from local storage
  //   if (!token) {
  //     console.error('No token found');
  //     return;
  //   }

  //   const response = await axios.get(`http://localhost:3000/user/${userId}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`, // Send the token in the header
  //     },
  //   });

  //   console.log('User data:', response.data);
  // } catch (error) {
  //   console.error('Error fetching user:', error);
  // }


  try {
    const token = localStorage.getItem("authToken"); // ✅ Use stored token
  
    if (!token) {
      console.log("No auth token found. User is not authenticated.");
      return;
    }
  
    const response = await axios.get("http://localhost:3000/user/profile", {
      headers: {
        "Content-Type": "application/json", // ✅ Ensures correct data format
        Authorization: `Bearer ${token}`, // ✅ Correct token format
      },
    });
  
    setUser(response.data.user);
    localStorage.setItem("user", JSON.stringify(response.data.user)); // ✅ Persist user data
  
  } catch (error) {
    console.error("Error fetching user:", error.response?.data || error.message);
  }
  
});


const getUsers = asyncHandler(async(req, res) => {
  try {
    const users = await userModel.find()
      .sort("-createAt")
      .select("-password");

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
    await axios.get("http://localhost:3000/user/logout", { withCredentials: true });

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



module.exports = { registerUser, loginUser,googleSignUp,googleSignIn ,setTransactionPin, getUser, getUsers, updateUser, deleteUser,LogoutUser};
