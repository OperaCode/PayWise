import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    frequency: {
        type: String,
        enum: ["one-time", "weekly", "monthly"],
        default: "one-time"
    },
    status: { type: String, enum: ['scheduled', 'processing', 'completed', 'failed'], default: 'scheduled' },
    group_id: { type: String }, // Links payments in the same group
    scheduledAt: { type: Date, required: true }, // Date & time for payment
    nextPaymentDate: { type: Date }, // Stores when the next payment should occur
    lastPaymentDate: { type: Date }, // Last successful payment
    createdAt: { type: Date, default: Date.now }
});


const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;





