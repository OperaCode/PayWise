const asyncHandler = require("express-async-handler");
const Biller = require("../models/billerModel");


const createBiller = asyncHandler(async (req, res) => {
    console.log("User in request:", req.user); // Debugging line
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }
  
    const { name, billerType, accountNumber, bankName, serviceType, email } = req.body;

    if (
      !name ||
      // !billerType ||
      // !accountNumber ||
      // !bankName ||
      // !serviceType ||   
      !email 
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    //  Check if the biller already exists (By accountNumber or email)
    const existingBiller = await Biller.findOne({ 
      $or: [{ accountNumber }, { email }] // Check if accountNumber OR email exists
  });

  if (existingBiller) {
      return res.status(400).json({ 
          message: `A biller with this ${existingBiller.accountNumber === accountNumber ? "account number" : "email"} already exists.` 
      });
  }

    // Count user's billers
    const userBillers = await Biller.find({ user: req.user._id });

    const vendorCount = userBillers.filter(b => b.billerType === "vendor").length;
    const beneficiaryCount = userBillers.filter(b => b.billerType === "beneficiary").length;

    // Restriction function based on billerType
    if (billerType === "vendor" && vendorCount >= 5) {
        return res.status(400).json({ message: "You can only have up to 5 vendors, Upgrade to get more." });
    }

    if (billerType === "beneficiary" && beneficiaryCount >= 1) {
        return res.status(400).json({ message: "You can only have 1 beneficiary,Upgrade to get more." });
    }
  
    const biller = await Biller.create({
      user: req.user._id,
      name,
      billerType,
      accountNumber,
      bankName,
      serviceType,
      //phone,
      email,
      //profilePicture,
    });
  
    res.status(201).json(biller);
  } catch (error) {
    console.error("Error creating biller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
   
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
