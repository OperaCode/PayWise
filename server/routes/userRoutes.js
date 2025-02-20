const express = require("express");
const {
  registerUser,
  loginUser,
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
router.post("/set-pin", setTransactionPin); 

router.get("/:userId", protectUser, getUser);
router.get("/", protectUser, getUsers);
router.patch("/:userId", protectUser, updateUser);
router.delete("/:userId", protectUser, deleteUser);
router.post("/logout", LogoutUser);

module.exports = router;
