require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/dbconnect");
const errorHandler = require("./middleware/errormiddleware");
const initializePassport = require("./config/passport"); // Import passport configuration
const session = require("express-session");
const passport = require("passport"); 

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

// Set up CORS with proper configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow sending cookies (if needed)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Explicitly handle preflight requests
app.options("*", cors());

// Configure passport
initializePassport(passport);

// Passport Middleware
app.use(session({ secret: "paywise-secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/biller", billerRoutes);
app.use("/payment", paymentRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to Database");

  // Error handler middleware should be at the end
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
