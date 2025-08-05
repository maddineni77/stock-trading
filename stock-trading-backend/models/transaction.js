const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  quantity: Number,
  price: Number,
  type: { type: String, enum: ['buy', 'sell'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
