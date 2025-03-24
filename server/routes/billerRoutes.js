const express = require("express");
const multer = require("multer");
const { 
  createBiller, 
  getBillers, 
  getBillerById, 
  updateBillerPicture,
  updateBiller, 
  deleteBiller 
} = require("../controllers/billerController");
const { protectUser } = require("../middleware/authMiddleWare");

const router = express.Router();


const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });



router.post("/createbiller", protectUser, createBiller);
router.get("/", protectUser, getBillers);
router.get("/:billerId", protectUser, getBillerById);
// app.post("/upload", upload.single("my_file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     const dataURI = `data:${req.file.mimetype};base64,${b64}`;
//     const cldRes = await handleUpload(dataURI);

//     res.json({ message: "File uploaded successfully", url: cldRes.secure_url });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

//router.put("/upload/:billerId", protectUser, updateBillerPicture);
router.put("/upload/:billerId", protectUser, upload.single("image"), updateBillerPicture);
//router.put("/:billerId/update-biller-picture", updateBillerPicture);
router.patch("/:billerId", protectUser, updateBiller);
router.delete("/:billerId", protectUser, deleteBiller);

module.exports = router;
