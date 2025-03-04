const express = require("express");
const User = require("../models/userModel")
const {
  registerUser,
  loginUser,
  googleSignUp,
  googleSignIn,
 // uploadProfilePicture,
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
router.post("/google-signup", googleSignUp); 
router.post("/google-login", googleSignIn); 
router.post("/set-pin", setTransactionPin); 

router.put("/:id/update-profile-picture", async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile picture updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:userId", protectUser, getUser);
router.get("/", protectUser, getUsers);
router.patch("/:userId", protectUser, updateUser);
router.delete("/:userId", protectUser, deleteUser);
router.post("/logout", LogoutUser);

module.exports = router;
