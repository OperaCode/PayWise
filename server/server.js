require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/dbconnect");

const app = express();
const PORT = process.env.PORT || 3000;

//Connect DB 
connectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://pay-wise-ecru.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
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



// payment scheduler
require("./config/paymentScheduler");

// Routes
app.use("/user", require("./routes/userRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/biller", require("./routes/billerRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));

//Start server after DB is ready
mongoose.connection.once("open", () => {
   ("Connected to Database");
  app.listen(PORT, () => {
     (`Server is running on port ${PORT}`);
  });
});
