const express = require("express");
const User = require("../models/userModel")
const {
  registerUser,
  loginUser,
  uploadProfilePicture,
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
// router.post("/google-signup", googleSignUp); 
// router.post("/google-login", googleSignIn); 
router.post("/set-pin", setTransactionPin); 

router.put("/:id/update-profile-picture", uploadProfilePicture);
router.get("/:userId", protectUser, getUser);
router.get("/", protectUser, getUsers);
router.patch("/:userId", protectUser, updateUser);
router.delete("/:userId", protectUser, deleteUser);
router.post("/logout", LogoutUser);

module.exports = router;
