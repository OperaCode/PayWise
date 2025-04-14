

const express = require("express");
const Biller = require("../models/billerModel")
const {billerUpload} = require("../config/cloudConfig.js"); // Multer middleware for file uploads
const {
  createBiller,
  getBillers,
  updateAutoPayStatus,
  getBillerById,
  searchUserByEmail,

  updateBiller,
  deleteBiller,
} = require("../controllers/billerController");

const { protectUser } = require("../middleware/authMiddleWare");

const router = express.Router();

// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });


router.get("/search/:email", searchUserByEmail);
router.post("/createbiller", protectUser, createBiller);
router.get("/", protectUser, getBillers);
router.get("/:billerId", protectUser, getBillerById);


router.put("/update/:billerId", protectUser, updateBiller);
router.put("/autopay/:billerId", protectUser, updateAutoPayStatus);
router.delete("/:billerId", protectUser, deleteBiller);

module.exports = router;
