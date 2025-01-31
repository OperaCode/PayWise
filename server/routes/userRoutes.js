

const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const {protectUser} = require("../middleware/authMiddleWare");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
