const asyncHandler = require("express-async-handler");
const Biller = require("../models/billerModel");
const User = require("../models/userModel");

// Create a new biller and associate it with the user
const createBiller = asyncHandler(async (req, res) => {
  const {
    name,
    billerType,
    accountNumber,
    bankName,
    serviceType,
    email,
    amount,
  } = req.body;

  // Check if user is authenticated
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized: No user ID found" });
  }

  // Find the user
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Create a new biller
  const newBiller = await Biller.create({
    name,
    billerType,
    accountNumber,
    bankName,
    serviceType,
    email,
    amount,
    user: req.userId, // Associate biller with the user
  });

  if (!newBiller) {
    return res.status(400).json({ message: "Failed to create biller" });
  }

  // Add the biller to the user's billers array and update user in one step
  const updatedUser = await User.findByIdAndUpdate(
    req.userId,
    { $push: { billers: newBiller._id } },
    { new: true } // Return the updated user
  ).populate("billers"); // Populate billers array with actual biller data

  res.status(201).json({
    message: "Biller created successfully",
    biller: newBiller,
    user: updatedUser, // Send updated user with billers populated
  });
});

const getBillers = asyncHandler(async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    // Find the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch billers for the logged-in user, populating necessary fields
    const billers = await Biller.find({ user: req.userId })
      .populate("biller", "firstName lastName email profilePicture") // ✅ Populate user details
      .populate("category", "name") // ✅ Populate category name
      .populate("transactions") // ✅ Populate transactions (if needed)
      .sort("-createdAt");

    // Check if no billers found
    if (!billers.length) {
      return res.status(404).json({ message: "No billers found" });
    }

    res.status(200).json(billers);
  } catch (err) {
    console.error("Error fetching billers:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getBillerById = asyncHandler(async (req, res) => {
  const biller = await Biller.findOne({
    _id: req.params.billerId,
    user: req.user._id,
  });

  if (!biller) {
    return res.status(404).json({ message: "Biller not found" });
  }

  res.status(200).json(biller);
});

const updateBiller = asyncHandler(async (req, res) => {
  const biller = await Biller.findOne({
    _id: req.params.billerId,
    user: req.user._id,
  });

  if (!biller) {
    return res.status(404).json({ message: "Biller not found" });
  }

  // Update only provided fields
  Object.assign(biller, req.body);
  await biller.save();

  res.status(200).json(biller);
});

const deleteBiller = asyncHandler(async (req, res) => {
  const biller = await Biller.findOneAndDelete({
    _id: req.params.billerId,
    user: req.user._id,
  });

  if (!biller) {
    return res.status(404).json({ message: "Biller not found" });
  }

  res.status(200).json({ message: "Biller deleted successfully" });
});

module.exports = {
  createBiller,
  getBillers,
  getBillerById,
  updateBiller,
  deleteBiller,
};
