const Price = require("../models/Price");

// Add price entry
const createPrice = async (req, res) => {
  try {
    const { stockId, price } = req.body;
    const newPrice = new Price({ stockId, price });
    await newPrice.save();
    res.status(201).json(newPrice);
  } catch (err) {
    res.status(500).json({ error: "Failed to create price entry." });
  }
};

// Get price history
const getPriceHistory = async (req, res) => {
  try {
    const { stockId } = req.params;
    const history = await Price.find({ stockId }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch price history." });
  }
};

module.exports = {
  createPrice,
  getPriceHistory,
};
