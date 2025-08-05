const express = require("express");
const router = express.Router();
const {
  createPrice,
  getPriceHistory,
} = require("../controllers/priceController"); // ✅ Make sure the path is correct and functions are exported

// Route to add a new price for a stock
router.post("/add", createPrice); // ✅ handler must be a function

// Route to get price history for a stock
router.get("/history/:stockId", getPriceHistory); // ✅ handler must be a function

module.exports = router;
