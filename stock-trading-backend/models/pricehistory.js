const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema({
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PriceHistory", priceHistorySchema);
