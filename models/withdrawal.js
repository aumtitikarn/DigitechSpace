import mongoose from 'mongoose';

// Define the receipt schema
const receiptSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  date: { type: String, required: true }, // Store as string to match the date format used
  gross: { type: Number, required: true },
  withdrawable: { type: Number, required: true },
  servicefee: { type: Number, required: true },
  email: { type: String, required: true },
});

// Define the main Withdrawal schema
const WithdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  withdrawn: {
    type: Number,
    get: (v) => parseFloat(v.toFixed(2)),
    required: true
  },
  net: {
    type: Number,
    get: (v) => parseFloat(v.toFixed(2)),
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  receipt: { 
    type: receiptSchema,
    required: true
  }
});

export default mongoose.models.Withdrawal || mongoose.model('Withdrawal', WithdrawalSchema);
