const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config(); // Load environment variables

// 🔹 Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Create Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = "general"; // Default folder

    if (req.url.includes("/user")) folderName = "users"; // Upload user pictures to "users" folder
    if (req.url.includes("/biller")) folderName = "billers"; // Upload biller pictures to "billers" folder

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

// 🔹 Create Multer Upload Middleware
const upload = multer({ storage });

module.exports = { cloudinary, upload };
