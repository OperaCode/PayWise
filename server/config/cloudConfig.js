const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config(); 

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for User Profile Pictures
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "users", 
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

//  Storage for Biller Profile Pictures
const billerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "billers", 
    allowed_formats: ["jpg", "png", "jpeg","webp", "avif"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

//  Multer Middleware (Fixed)
const userUpload = multer({ storage: userStorage });
const billerUpload = multer({ storage: billerStorage });

module.exports = { cloudinary, userUpload, billerUpload };
