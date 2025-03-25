const asyncHandler = require("express-async-handler");
const Biller = require("../models/billerModel");
const User = require("../models/userModel");
const {billerUpload,cloudinary} = require("../config/cloudConfig.js"); // Multer middleware for file uploads



// const createBiller = asyncHandler(async (req, res) => {
//   const {
//     name,
//     billerType,
//     accountNumber,
//     bankName,
//     serviceType,
//     email,
//     amount,
//   } = req.body;

//   // Check if user is authenticated
//   if (!req.userId) {
//     return res.status(401).json({ message: "Unauthorized: No user ID found" });
//   }

//   // Find the user
//   const user = await User.findById(req.userId);
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Validate billerType
//   if (!["Vendor", "Beneficiary"].includes(billerType)) {
//     return res.status(400).json({ message: "Invalid biller type" });
//   }

//   // Check if the user has already added this biller
//   if (user.billers.some((biller) => biller.accountNumber === accountNumber)) {
//     return res.status(400).json({
//       message: "This account number is already associated with your account",
//     });
//   }

//   // Count the user's billers by type
//   const vendorCount = user.billers.filter(
//     (biller) => biller.billerType === "Vendor"
//   ).length;
//   const beneficiaryCount = user.billers.filter(
//     (biller) => biller.billerType === "Beneficiary"
//   ).length;

//   // Enforce limit for vendors and beneficiaries
//   if (billerType === "Vendor" && vendorCount >= 5) {
//     return res.status(400).json({ message: "You can only register up to 5 vendors." });
//   }

//   if (billerType === "Beneficiary" && beneficiaryCount >= 1) {
//     return res.status(400).json({ message: "You can only register 1 beneficiary." });
//   }

//   // Create a new biller
//   const newBiller = await Biller.create({
//     name,
//     billerType,
//     accountNumber,
//     bankName,
//     serviceType,
//     email,
//     amount,
//     user: req.userId, // Associate biller with the user
//   });

//   if (!newBiller) {
//     return res.status(400).json({ message: "Failed to create biller" });
//   }

//   // Add the biller to the user's billers array and update the user
//   const updatedUser = await User.findByIdAndUpdate(
//     req.userId,
//     { $push: { billers: newBiller._id } },
//     { new: true } // Return the updated user
//   ).populate("billers"); // Populate billers array with actual biller data

//   res.status(201).json({
//     message: "Biller created successfully",
//     biller: newBiller,
//     user: updatedUser, // Send updated user with billers populated
//   });
// });


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

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized: No user ID found" });
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let billerImageUrl = "";

  // Check if an image file was uploaded
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "Billers" }, // Store in the "Billers" folder in Cloudinary
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            return res.status(500).json({ message: "Failed to upload image" });
          }
          billerImageUrl = result.secure_url;
        }
      ).end(req.file.buffer);
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
    }
  }

  const newBiller = await Biller.create({
    name,
    billerType,
    accountNumber,
    bankName,
    serviceType,
    email,
    amount,
    profilePicture: billerImageUrl, // Save the uploaded image URL
    user: req.userId,
  });

  user.billers.push(newBiller._id);
  await user.save();

  res.status(201).json({
    message: "Biller created successfully",
    biller: newBiller,
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
      return res.status(404).json({ message: "No Biller Found, Please Register Biller!" });
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



// const uploadBillerPicture = asyncHandler(async (req, res) => {
//   const { id } = req.params; // Get biller ID from request params

//   if (!req.file) {
//     return res.status(400).json({ message: "No image file uploaded" });
//   }

//   const biller = await Biller.findById(id);
//   if (!biller) {
//     return res.status(404).json({ message: "Biller not found" });
//   }

//   // Upload image to Cloudinary
//   const result = await cloudinary.uploader.upload(req.file.path, {
//     folder: "billers",
//   });

//   biller.profilePicture = result.secure_url; // Update biller profile picture
//   await biller.save();

//   res.json({
//     message: "Biller profile picture uploaded successfully",
//     profilePicture: biller.profilePicture,
//   });
// });


const uploadBillerPicture = asyncHandler(async (req, res) => {
  const { billerId } = req.params;

  // Ensure user is authenticated (from protectUser middleware)
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized: No user ID found" });
  }

  
// Find the biller by ID
const biller = await Biller.findById(id);
if (!biller) {
  return res.status(404).json({ message: "Biller not found" });
}

// Upload to Cloudinary, ensuring it goes into the "billers" folder
console.log("Uploading to Cloudinary...");
const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "Billers", // ✅ Ensures it goes into the "billers" folder
  public_id: `biller_${id}`, // Optional: Assign a unique name
  resource_type: "image", // Ensures it's an image
});

console.log("Cloudinary Upload Success:", result);

console.log(result);
  // ✅ Update biller model, not user model
  biller.profilePicture = result.secure_url;
  await biller.save();

  res.json({
    message: "Biller profile picture uploaded successfully",
    profilePicture: biller.profilePicture,
  });
});

module.exports = {
  createBiller,
  getBillers,
  uploadBillerPicture,
  getBillerById,
  updateBiller,
  deleteBiller,
};
