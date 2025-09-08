const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  console.log('[REGISTER] Request received:', {
    method: req.method,
    url: req.url,
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent'),
    body: { ...req.body, password: '[HIDDEN]' }
  });
  
  try {
    const { username, email, password, userType } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      console.log('[REGISTER] Validation failed - missing fields');
      return res.status(400).json({ success:false,message: "All fields are required" });
    }
    // Validate userType
    if (userType && !['user', 'admin'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
     const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email or username' 
      });
    }
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
   const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userType: userType || 'user', // Default to 'user' if not specified
      balance: 10000, // default balance
      loanAmount: 0,
      portfolio: [],
    });

    await newUser.save();

    // Generate JWT token
     const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email, 
        username: newUser.username,
        userType: newUser.userType
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
      { expiresIn: '24h' }
    );

     const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      userType: newUser.userType,
      balance: newUser.balance,
      createdAt: newUser.createdAt
    };
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Demo users (fallback for quick testing)
    if ((email === 'demo@user.com' || email === 'admin@stock.com') && password) {
      const isAdmin = email === 'admin@stock.com';
      const demoUser = {
        _id: isAdmin ? 'admin1' : 'user1',
        username: isAdmin ? 'DemoAdmin' : 'DemoUser',
        email,
        userType: isAdmin ? 'admin' : 'user',
        balance: 10000,
        createdAt: new Date()
      };
      const token = jwt.sign(
        { userId: demoUser._id, email: demoUser.email, username: demoUser.username, userType: demoUser.userType },
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
        { expiresIn: '24h' }
      );
      return res.json({ message: 'Login successful', user: demoUser, token });
    }

    // Check if user exists in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
      { expiresIn: '24h' }
    );

    // Send response without password
    const { password: _, ...userResponse } = user.toObject();
    
    res.json({ 
      message: 'Login successful', 
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

const updateBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body; // amount can be +ve or -ve

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.balance += amount;
    user.updatedAt = new Date();

    await user.save();

    res.json({ message: 'Balance updated', balance: user.balance });

  } catch (error) {
    res.status(500).json({ message: 'Error updating balance', error });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ balance: -1 }); // leaderboard
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};
// Updated getPortfolio function
const getPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate({
        path: 'portfolio.stockId',
        select: 'symbol currentPrice priceChangePercent',
        model: 'Stock'
      })
      .select('portfolio balance');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out invalid portfolio items and calculate values
    const validPortfolio = user.portfolio.filter(item => item.stockId);
    const portfolioValue = validPortfolio.reduce((total, item) => {
      return total + (item.stockId?.currentPrice || 0) * item.quantity;
    }, 0);

    res.json({
      success: true,
      data: {
        stocks: validPortfolio.map(item => ({
          symbol: item.stockId.symbol,
          shares: item.quantity,
          avgPrice: item.averagePrice,
          currentPrice: item.stockId.currentPrice,
          changePercent: item.stockId.priceChangePercent
        })),
        totalValue: portfolioValue,
        cashBalance: user.balance,
        netWorth: portfolioValue + user.balance
      }
    });
  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error getting portfolio',
      error: error.message 
    });
  }
};

// Updated getUserReport function
const getUserReport = async (req, res) => {
  try {
    // Support both route param and query param
    const userId = req.params.userId || req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'userId query parameter is required' 
      });
    }

    const user = await User.findById(userId)
      .populate({
        path: 'portfolio.stockId',
        select: 'symbol currentPrice priceChangePercent',
        model: 'Stock'
      })
      .select('portfolio balance username createdAt');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Filter valid portfolio items
    const validPortfolio = user.portfolio.filter(item => item.stockId);
    
    // Calculate portfolio metrics
    const portfolioValue = validPortfolio.reduce((total, item) => {
      return total + (item.stockId?.currentPrice || 0) * item.quantity;
    }, 0);

    // Generate report
    const report = {
      userId: user._id,
      username: user.username,
      accountAge: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24)) + ' days',
      portfolioSummary: {
        totalHoldings: validPortfolio.length,
        totalValue: portfolioValue,
        cashBalance: user.balance,
        netWorth: portfolioValue + user.balance
      },
      topPerformers: validPortfolio
        .sort((a, b) => (
          (b.stockId?.priceChangePercent || 0) - 
          (a.stockId?.priceChangePercent || 0)
        ))
        .slice(0, 3)
        .map(item => ({
          symbol: item.stockId.symbol,
          return: item.stockId.priceChangePercent + '%',
          value: (item.stockId.currentPrice * item.quantity).toFixed(2)
        })),
      createdAt: new Date()
    };

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating report',
      error: error.message 
    });
  }
};
const getUserBalance = async (req, res) => {
  try {
    const { userId } = req.params;  // Changed from username to userId
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId)  // Using userId directly
      .select('balance username')
      .lean();
      
    if (!user) {
      return res.status(404).json({ 
        success: false,  // Added for consistency
        message: 'User not found' 
      });
    }

    return res.json({  // Added return statement
      success: true,
      balance: user.balance,
      username: user.username
    });
    
  } catch (error) {
    console.error('Balance error:', error);
    return res.status(500).json({  // Added return statement
      success: false,
      message: 'Error fetching balance',
      error: error.message 
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getPortfolio,
  updateBalance,
  getAllUsers,
  getUserBalance,
  getUserReport
};
