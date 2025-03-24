require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/dbconnect");
const errorHandler = require("./middleware/errormiddleware");
const initializePassport = require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const billerRoutes = require("./routes/billerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = 3000;

connectDb();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for handling cookies
app.use(cookieParser());

// Set up CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload to Cloudinary
async function handleUpload(file) {
  try {
    const res = await cloudinary.uploader.upload(file, { resource_type: "auto" });
    return res;
  } catch (error) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
}

// Multer setup for memory storage
const storage = new Multer.memoryStorage();
const upload = Multer({ storage });

// Upload Route
app.post("/upload", upload.single("my_file"), async (req, res) => {
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

// Configure passport
// initializePassport(passport);
// app.use(session({ secret: "paywise-secret", resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/biller", billerRoutes);
app.use("/payment", paymentRoutes);

// Start server
mongoose.connection.once("open", () => {
  console.log("Connected to Database");

  // Error handler middleware at the end
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
