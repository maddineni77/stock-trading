const express = require("express");
const router = express.Router();
const {
  registerStock,
  getPriceHistory,
  getStockReport,
  getTopStocks,
  getAllStocks
} = require("../controllers/stockController");

router.post("/register", registerStock);
router.get("/history", getPriceHistory);
router.get("/report", getStockReport);
router.get("/top", getTopStocks);
router.get("/", getAllStocks);


module.exports = router;
