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
router.get('/:userId/portfolio', authenticateToken, getPortfolio); // Get user portfolio
router.get('/:userId/balance', authenticateToken, getUserBalance); // Get user balance
router.get('/:userId/report', authenticateToken, getUserReport); // Get user report
router.put('/:userId/balance', authenticateToken, updateBalance); // Update user balance

module.exports = router;