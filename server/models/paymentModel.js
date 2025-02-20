import mongoose from 'mongoose';


const RecurringPaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    biller: { type: mongoose.Schema.Types.ObjectId, ref: "Biller", required: true }, // Receiver
    amount: { type: Number, required: true },
    method:{type: Number, enum: ["wallet", "rewards"], require:true},
    frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    nextExecution: { type: Date, required: true },
    status: { type: String, enum: ["active", "paused", "canceled"], default: "active" },
    createdAt: { type: Date, default: Date.now },
  });



const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    biller: { type: mongoose.Schema.Types.ObjectId, ref: 'Biller', required: true },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    // currency: {
    //     type: String,
    //     required: true,
    //     default: 'usd' // Set to 'usd' if all transactions are in dollars
    //   },

    RecurringPayment: RecurringPaymentSchema,  
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


const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;





