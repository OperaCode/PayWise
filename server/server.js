require("dotenv").config();
const mongoose = require("mongoose");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errormiddleware");
const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const vendorRoutes = require("./routes/vendorRoute");

const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-control-Allow-Origin", "*");
  next();
});

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use("/user", userRoutes);
app.use("/payment", paymentRoutes);
app.use("/vendor", vendorRoutes);

// Connect to MongoDB

connectDb();

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to Database");
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
