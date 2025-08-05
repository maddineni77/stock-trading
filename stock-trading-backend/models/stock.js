const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  availableQty: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  priceHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "PriceHistory" }],
}, { timestamps: true });

module.exports = mongoose.model("Stock", stockSchema);
