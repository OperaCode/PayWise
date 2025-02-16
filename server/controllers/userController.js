const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");



const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN, {
    expiresIn: "30d", // Token expires in 30 days
  });
};



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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with a transaction wallet
    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      wallet: {
        balance: 0,
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
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials, user not found" });
    }

    // // Ensure password is correctly hashed before comparing
    // if (typeof user.password !== "string") {
    //   console.error("Stored password is not a string:", user.password);
    //   return res.status(500).json({ message: "Password storage error" });
    // }

    
    // Debugging password mismatch issue
    // console.log("Input Password:", password);
    // console.log("Stored Password:", user.password);
    
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.error("Password mismatch detected:", { inputPassword: password, storedPassword: user.password });
      return res.status(401).json({ message: "Invalid credentials" });
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

    const { _id, firstName, lastName } = user;
    res.status(200).json({
      _id,
      fullName: `${firstName} ${lastName}`,
      email,
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getUser = asyncHandler(async (req, res) => {

});





module.exports = { registerUser, loginUser};
