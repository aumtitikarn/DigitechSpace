import mongoose from "mongoose";
import { getThaiDateTime } from './date';

const orderSchema = new mongoose.Schema({
  email: {
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
    get: (v) => parseFloat(v.toFixed(2)),
  },
  servicefee: {
    type: Number,
    required: true,
    get: (v) => parseFloat(v.toFixed(2)),
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
  check: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: getThaiDateTime,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
