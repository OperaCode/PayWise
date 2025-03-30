const asyncHandler = require("express-async-handler");
const Biller = require("../models/billerModel");
const User = require("../models/userModel");
const { billerUpload, cloudinary } = require("../config/cloudConfig.js");
const { updateBillerAmount } = require("../hooks/aggrAmount");



const createBiller = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debugging line

    const { fullName, nickname, email, serviceType, walletId, profilePicture } = req.body;
    const userId = req.user?.id || req.body.user; // Get user ID from req.user or req.body

    if (!fullName || !nickname || !email || !serviceType || !walletId || !userId) {
      return res.status(400).json({ message: "All fields are required, including user ID!" });
    }

    // to find user and check if they already have this biller**
    const user = await User.findById(userId).populate("billers");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    //to check if user already added this biller**
    const billerExists = user.billers.some((biller) => biller.email === email);
    if (billerExists) {
      return res.status(400).json({ message: "You have already added this biller!" });
    }

    // create the new biller**
    const newBiller = new Biller({
      name: fullName,
      nickname,
      email,
      serviceType,
      walletId,
      profilePicture,
      user: userId, 
    });

    await newBiller.save();

    // Update the User’s billers List 
    user.billers.push(newBiller._id);
    await user.save();

    console.log("Updated User Billers:", user.billers); 

    res.status(201).json({ message: "Biller created successfully!", biller: newBiller });
  } catch (error) {
    console.error("Error creating biller:", error);
    res.status(500).json({ message: "Error creating biller" });
  }
};

const getBillers = asyncHandler(async (req, res) => {
  try {
    // Find the user
    const user = await User.findById(req.userId).populate("billers");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Fetch only the billers associated with this user
    const billers = user.billers;

    if (!billers || billers.length === 0) {
      return res
        .status(404)
        .json({ message: "No Biller Found, Please Register Biller!" });
    }

    // Recalculate amount for each biller before sending response
    for (let biller of billers) {
      await updateBillerAmount(biller._id);
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

// Search for a user by email and return details
const searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Find biller in the database
    const biller = await User.findOne({ email });

    if (!biller) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct full name
    const fullName = `${biller.firstName} ${biller.lastName}`.trim();

    // Return only the necessary details for user form
    res.json({
      biller: {
        ...biller.toObject(),
        fullName, // Attach full name
      },
    });

    console.log("Biller found:", biller);
  } catch (error) {
    console.error("Error searching for biller:", error);
    res.status(500).json({ message: "Error searching for biller" });
  }
};

// const updateBiller = asyncHandler(async (req, res) => {
//   const user = await Biller.findOne({
//     _id: req.params.billerId,
//     user: req.user._id,
//   });

//   if (!biller) {
//     return res.status(404).json({ message: "Biller not found" });
//   }

//   // Construct full name
//   const fullName = `${biller.firstName} ${biller.lastName}`;

//   // Return biller details with full name
//   res.json({
//     biller: {
//       ...biller.toObject(),
//       fullName, // Include full name
//     },
//   });

//   // Update only provided fields
//   //Object.assign(biller, req.body);
//   await biller.save();

//   res.status(200).json(biller);
// });


const updateBiller = async (req, res) => {
  try {
    const { billerId } = req.params;
    const { fullName, nickname, email, serviceType, walletId, profilePicture } = req.body;

    if (!billerId) {
      return res.status(400).json({ message: "Biller ID is required!" });
    }

    const updatedBiller = await Biller.findByIdAndUpdate(
      billerId,
      {
        name: fullName,
        nickname,
        email,
        serviceType,
        walletId,
        profilePicture,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBiller) {
      return res.status(404).json({ message: "Biller not found!" });
    }

    res.json({ success: true, message: "Biller updated successfully!", biller: updatedBiller });
  } catch (error) {
    console.error("Error updating biller:", error);
    res.status(500).json({ success: false, message: "Error updating biller" });
  }
};



const deleteBiller = asyncHandler(async (req, res) => {
  try {
    const { billerId } = req.params;

    // Ensure user is authenticated (from protectUser middleware)
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
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
  searchUserByEmail,
  getBillerById,
  updateBiller,
  deleteBiller,
};
