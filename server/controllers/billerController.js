const asyncHandler = require("express-async-handler");
const Biller = require("../models/billerModel");


const createBiller = asyncHandler(async (req, res) => {
    console.log("User in request:", req.user); // Debugging line
  
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }
  
    const { name, category, accountNumber, bankName, serviceType, phone, email } = req.body;
  
    const biller = await Biller.create({
      user: req.user._id,
      name,
      category,
      accountNumber,
      bankName,
      serviceType,
      phone,
      email,
    });
  
    res.status(201).json(biller);
  });


const getBillers = asyncHandler(async (req, res) => {
  const billers = await Biller.find({ user: req.user._id });
  res.status(200).json(billers);
});


const getBillerById = asyncHandler(async (req, res) => {
  const biller = await Biller.findOne({ _id: req.params.billerId, user: req.user._id });

  if (!biller) {
    return res.status(404).json({ message: "Biller not found" });
  }

  res.status(200).json(biller);
});


const updateBiller = asyncHandler(async (req, res) => {
  const biller = await Biller.findOne({ _id: req.params.billerId, user: req.user._id });

  if (!biller) {
    return res.status(404).json({ message: "Biller not found" });
  }

  // Update only provided fields
  Object.assign(biller, req.body);
  await biller.save();

  res.status(200).json(biller);
});


const deleteBiller = asyncHandler(async (req, res) => {
  const biller = await Biller.findOneAndDelete({ _id: req.params.billerId, user: req.user._id });

  if (!biller) {
    return res.status(404).json({ message: "Biller not found" });
  }

  res.status(200).json({ message: "Biller deleted successfully" });
});

module.exports = {
  createBiller,
  getBillers,
  getBillerById,
  updateBiller,
  deleteBiller,
};
