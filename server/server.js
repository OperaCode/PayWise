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


const app = express();
const PORT = 3000;




// Set up CORS
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());


connectDb();


// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //for cookies 


require("./config/paymentScheduler");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const billerRoutes = require("./routes/billerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");



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
