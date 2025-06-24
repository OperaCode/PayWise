require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/dbconnect");
// const errorHandler = require("./middleware/errorMiddleWare");
// const initializePassport = require("./config/passport");
// const session = require("express-session");
// const passport = require("passport");
//const cloudinary = require("cloudinary").v2;
// const Multer = require("multer");

require('./config/paymentScheduler');
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
  // app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
