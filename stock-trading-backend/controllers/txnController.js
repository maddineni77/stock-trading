const User = require('../models/user');
const Transaction = require('../models/transaction');
const Stock = require('../models/stock');

const buyStock = async (req, res) => {
  try {
    const { userId, stockId, quantity, pricePerUnit } = req.body;
    const totalCost = quantity * pricePerUnit;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct balance
    user.balance -= totalCost;

    // Check if stock already in portfolio
    const existingStock = user.portfolio.find(item => item.stockId.toString() === stockId);
    if (existingStock) {
      existingStock.quantity += quantity;
    } else {
      user.portfolio.push({ stockId, quantity });
    }

    await user.save();

    // Record transaction
    const txn = new Transaction({
      userId,
      stockId,
      quantity,
      price: pricePerUnit,
      type: 'buy',
      createdAt: new Date()
    });
    await txn.save();

    res.json({ message: 'Stock purchased', balance: user.balance });

  } catch (err) {
    res.status(500).json({ message: 'Buy transaction failed', error: err.message });
  }
};
const sellStock = async (req, res) => {
  try {
    const { userId, stockId, quantity, pricePerUnit } = req.body;
    const totalAmount = quantity * pricePerUnit;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingStock = user.portfolio.find(item => item.stockId.toString() === stockId);
    if (!existingStock || existingStock.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock to sell' });
    }

    // Update portfolio
    existingStock.quantity -= quantity;
    if (existingStock.quantity === 0) {
      user.portfolio = user.portfolio.filter(item => item.stockId.toString() !== stockId);
    }

    // Add to balance
    user.balance += totalAmount;
    await user.save();

    // Record transaction
    const txn = new Transaction({
      userId,
      stockId,
      quantity,
      price: pricePerUnit,
      type: 'sell',
      createdAt: new Date()
    });
    await txn.save();

    res.json({ message: 'Stock sold', balance: user.balance });

  } catch (err) {
    res.status(500).json({ message: 'Sell transaction failed', error: err.message });
  }
};
const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).populate('stockId', 'name symbol').sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch transactions', error: err.message });
  }
};
module.exports = {
  getUserTransactions,
  sellStock,
  buyStock
};