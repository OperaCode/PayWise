const express = require("express");
const { 
  createBiller, 
  getBillers, 
  getBillerById, 
  updateBiller, 
  deleteBiller 
} = require("../controllers/billerController");
const { protectUser } = require("../middleware/authMiddleWare");

const router = express.Router();

router.post("/createbiller", protectUser, createBiller);
router.get("/", protectUser, getBillers);
router.get("/:billerId", protectUser, getBillerById);
router.patch("/:billerId", protectUser, updateBiller);
router.delete("/:billerId", protectUser, deleteBiller);

module.exports = router;
