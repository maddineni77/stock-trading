const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getPortfolio,
  updateBalance,
  getAllUsers,
  getUserBalance,
  getUserReport
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Authenticated routes
router.get('/', authenticateToken, getAllUsers); // Get all users
router.get('/:userId', authenticateToken, getUserProfile); // Get user profile
router.get('/:username/portfolio', authenticateToken, getPortfolio); // Get user portfolio
router.get('/:username/balance', authenticateToken, (req, res) => {
  // First verify the user exists
  if (!req.user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }
  res.json({
    success: true,
    balance: req.user.balance,
    username: req.user.username // Include username in response
  });
  // Then proceed with balance logic
  getUserBalance(req, res);
}); // Get user balance
router.get('/:userId/report', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }
  res.json({
    success: true,
    totalProfitLoss: 1500,
    totalTrades: 42,
    recentTrades: [] // Add actual trade data
  });
  getUserReport(req, res);
}); // Get user report
router.put('/:userId/balance', authenticateToken, updateBalance); // Update user balance

module.exports = router;