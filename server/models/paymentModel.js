import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },

    frequency: { 
      type: String, 
      enum: ['one-time', 'daily', 'weekly', 'bi-weekly', 'monthly'], 
      default: 'one-time' 
    },
    //status: { type: String, enum: ['scheduled', 'processing', 'completed', 'failed'], default: 'scheduled' },
    scheduledAt: { type: Date, required: true }, // Date & time for payment
    nextPaymentDate: { type: Date }, // Stores when the next payment should occur
    lastPaymentDate: { type: Date }, // Last successful payment
    createdAt: { type: Date, default: Date.now }
  });
  

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;





