const Stock = require("../models/stock");
const PriceHistory = require("../models/pricehistory");
const Transaction = require("../models/transaction");
const StockDataService = require('../config/stockAPI');

const registerStock = async (req, res) => {
  try {
    const { name, quantity, price } = req.body;

    const existing = await Stock.findOne({ name });
    if (existing) return res.status(400).json({ message: "Stock already exists" });

    const stock = new Stock({ name, availableQuantity: quantity, currentPrice: price });
    await stock.save();

    // Add initial price to PriceHistory
    const history = new PriceHistory({
      stockId: stock._id,
      price,
      timestamp: new Date(),
    });
    await history.save();

    res.status(201).json({ message: "Stock registered", stock });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getPriceHistory = async (req, res) => {
  try {
    const { stockId } = req.query;
    let history;

    if (stockId) {
      history = await PriceHistory.find({ stockId }).sort({ timestamp: -1 });
    } else {
      history = await PriceHistory.find().sort({ timestamp: -1 });
    }

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
};
const getStockReport = async (req, res) => {
  try {
    const stocks = await Stock.find();
    const report = [];

    for (let stock of stocks) {
      const buys = await Transaction.find({ stockId: stock._id, type: "buy" });
      const sells = await Transaction.find({ stockId: stock._id, type: "sell" });

      const totalBuy = buys.reduce((sum, t) => sum + t.quantity, 0);
      const totalSell = sells.reduce((sum, t) => sum + t.quantity, 0);
      const netQty = totalBuy - totalSell;

      report.push({
        stockName: stock.name,
        currentPrice: stock.currentPrice,
        totalBuy,
        totalSell,
        netQty
      });
    }

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: "Error generating report", error: err.message });
  }
};
const getTopStocks = async (req, res) => {
  try {
    const allStocks = await Stock.find();
    const stats = [];

    for (let stock of allStocks) {
      const buys = await Transaction.find({ stockId: stock._id, type: "buy" });
      const totalBuyQty = buys.reduce((sum, b) => sum + b.quantity, 0);

      stats.push({
        stockName: stock.name,
        totalBuyQty,
        currentPrice: stock.currentPrice
      });
    }

    // Sort by totalBuyQty DESC
    stats.sort((a, b) => b.totalBuyQty - a.totalBuyQty);
    res.status(200).json(stats.slice(0, 5)); // top 5 stocks
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top stocks", error: err.message });
  }
};
const getRealTimeQuote = async (req, res) => {
  const { symbol } = req.params;
  try {
    const quote = await StockDataService.getQuote(symbol);
    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMultipleRealTimeQuotes = async (req, res) => {
  const { symbols } = req.body;
  try {
    const quotes = await StockDataService.getMultipleQuotes(symbols);
    res.json({ success: true, data: quotes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const searchStocks = async (req, res) => {
  try {
    const { keywords } = req.params;
    if (!keywords || keywords.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search keywords must be at least 2 characters'
      });
    }

    const results = await StockDataService.searchStocks(keywords);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Stock search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search stocks' 
    });
  }
};
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json({
      success: true,
      data: stocks
    });
  } catch (err) {
    console.error('Error fetching stocks:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stocks'
    });
  }
};




module.exports = {
  registerStock,
  getPriceHistory,
  getStockReport,
  getTopStocks,
   getRealTimeQuote,
  getMultipleRealTimeQuotes,
  searchStocks,
  getAllStocks
};
