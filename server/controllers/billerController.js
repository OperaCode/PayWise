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

  // Check if the user has already associated the biller with their account
  if (user.billers.some((biller) => biller.accountNumber === accountNumber)) {
    return res.status(400).json({
      message: "This account number is already associated with your account",
    });
  }

  // Count the user's billers based on type
  const vendorCount = user.billers.filter(
    (biller) => biller.billerType === "Vendor"
  ).length;
  const beneficiaryCount = user.billers.filter(
    (biller) => biller.billerType === "Beneficiary"
  ).length;
  // Enforce limit for vendors and beneficiary
  if (billerType === "Vendor" && vendorCount <= 5) {
    return res
      .status(400)
      .json({ message: "You can only register up to 5 vendors." });
  }

  if (billerType === "Beneficiary" && beneficiaryCount <= 1) {
    return res
      .status(400)
      .json({ message: "You can only register 1 beneficiary." });
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
    // Find the user
    const user = await User.findById(req.userId).populate("billers");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // ✅ Fetch only the billers associated with this user
    const billers = user.billers;

    if (!billers || billers.length === 0) {
      return res.status(404).json({ message: "No billers found" });
    }

    res.status(200).json(billers);
  } catch (error) {
    console.error("Error fetching billers:", error);
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
  try {
    const { billerId } = req.params;

    // Ensure user is authenticated (from protectUser middleware)
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    // Check if the biller exists and belongs to the authenticated user
    const biller = await Biller.findOneAndDelete({
      _id: billerId,
      user: req.userId, // Ensures the user can only delete their own billers
    });

    if (!biller) {
      return res.status(404).json({ message: "Biller not found" });
    }

    res.status(200).json({ message: "Biller deleted successfully", billerId });
  } catch (error) {
    console.error("Error deleting biller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = {
  createBiller,
  getBillers,
  getBillerById,
  updateBiller,
  deleteBiller,
};
