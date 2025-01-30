require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/errormiddleware");

const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const vendorRoutes = require("./routes/vendorRoute");

const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for handling cookies
app.use(cookieParser());

// Set up CORS with proper configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/user", userRoutes);
app.use("/payment", paymentRoutes);
app.use("/vendor", vendorRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to Database");

  // Error handler middleware should be at the end
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
