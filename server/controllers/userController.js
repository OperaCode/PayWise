const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    } else if (password.length > 20) {
      return res.status(400).json({ message: "Password must not be more than 20 characters" });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await userModel.create({ firstName, lastName, email, password: hashedPassword });

    if (user) {
      // Generate a token for the user
      const token = generateToken(user._id);
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 86400000), // Correct expiration time (24h)
        sameSite: "none",
        secure: true,
      });
      
      // Send a success response with the user details and token
      res.status(201).json({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        token,
      });
   
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Credentials: Password mismatch" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400000),
      sameSite: "none",
      secure: true,
    });

    const { _id, firstName, lastName, role } = user;
    res.status(200).json({ _id, fullName: `${firstName} ${lastName}`, email, role, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = { registerUser, loginUser, getUser, getBeneficiaries };
