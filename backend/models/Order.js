const mongoose = require('mongoose');
const { getModelProxy } = require('../utils/dbFallback');

const orderSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String },
  address: { type: String },
  paymentMethod: { type: String },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  adminMessage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const orderModel = mongoose.model('Order', orderSchema);
module.exports = getModelProxy('orders', orderModel);

