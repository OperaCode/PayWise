const express = require("express");
const User = require("../models/userModel")
const upload = require("../config/cloudConfig.js"); // Multer middleware for file uploads
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
router.post("/upload", upload.single("my_file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const cldRes = await handleUpload(dataURI);

    res.json({ message: "File uploaded successfully", url: cldRes.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/set-pin", setTransactionPin); 

router.put("/:id/update-profile-picture", uploadProfilePicture);
router.get("/:userId",protectUser , getUser);
router.get("/", protectUser, getUsers);
router.patch("/:userId", protectUser, updateUser);
router.delete("/:userId", protectUser, deleteUser);
router.post("/logout", LogoutUser);

module.exports = router;
