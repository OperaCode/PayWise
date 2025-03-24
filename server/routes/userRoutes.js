const express = require("express");
const User = require("../models/userModel")
const {userUpload} = require("../config/cloudConfig.js"); // Multer middleware for file uploads
const {
  registerUser,
  loginUser,
  uploadProfilePicture,
  connectWallet,
  setTransactionPin,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  LogoutUser
} = require("../controllers/userController");

const { protectUser } = require("../middleware/authMiddleWare");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser); 
router.post('/connect-metamask',connectWallet);

router.post("/set-pin", setTransactionPin); 

//router.put("/:id/update-profile-picture", uploadProfilePicture);
router.get("/:userId",protectUser , getUser);
router.get("/", protectUser, getUsers);
router.patch("/:userId", protectUser, updateUser);
router.delete("/:userId", protectUser, deleteUser);
router.post("/logout", LogoutUser);
// ✅ Upload Profile Picture
router.put(
  "/upload-profile-picture",
  protectUser,
  userUpload.single("profilePicture"), // ✅ Now this should work
  uploadProfilePicture
);


// router.post("/upload-profile-picture", userUpload.single("profilePicture"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const userId = req.user.id; // Assuming user ID is available from authentication middleware
//     const imageUrl = req.file.path; // Cloudinary URL

//     // 🔹 Update User Profile Picture in MongoDB
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePicture: imageUrl },
//       { new: true }
//     );

//     res.json({ message: "Profile picture updated successfully", user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// });




module.exports = router;
