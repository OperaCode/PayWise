const mongoose = require("mongoose");
const Payment = require("../models/paymentModel");
const Biller = require("../models/billerModel");

const updateBillerAmount = async (billerId) => {
  try {
    const totalAmount = await Payment.aggregate([
      { $match: { biller: new mongoose.Types.ObjectId(billerId) } }, // Filter payments by biller
      { $group: { _id: null, total: { $sum: "$amount" } } } // Sum the 'amount' field
    ]);

    const aggregatedAmount = totalAmount.length > 0 ? totalAmount[0].total : 0;

    // Update the biller's amount
    await Biller.findByIdAndUpdate(billerId, { amount: aggregatedAmount });

    return aggregatedAmount;
  } catch (error) {
    console.error("Error updating biller amount:", error);
  }
};

module.exports = { updateBillerAmount };
