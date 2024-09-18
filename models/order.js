import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  net: {
    type: Number,
    required: true,
    get: (v) => parseFloat(v.toFixed(2))
},
  typec: {
    type: String,
    required: true,
  },
  chargeId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;