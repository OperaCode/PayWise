const mongoose = require('mongoose');




const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    biller: { type: mongoose.Schema.Types.ObjectId, ref: 'Biller', required: true },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    isRecurring: {type: Boolean, default: false},  
    method:{type: Number, enum: ["wallet", "rewards"], require:true},
    nextExecution: { type: Date, required: true },
    startDate: { type: Date, required: true, default: Date.now },
    paymentMethod: {
        type: String,
        enum: ['Wallet', 'Stripe'],
        default: 'Wallet'
    },
    description: { type: String },
    

    // referenceId: { type: String }, // External reference ID for the payment


    // scheduledAt: { type: Date, required: true }, // Date & time for payment

    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Payment", PaymentSchema);





