const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const stockRoutes = require("./routes/stockRoutes");
const userRoutes = require("./routes/userRoutes");
const loanRoutes = require("./routes/loanRoutes");
const txnRoutes = require("./routes/txnRoutes");
const priceRoutes = require("./routes/priceRoutes");


const aiController = require('./controllers/aiController');
const stockController = require('./controllers/stockController');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5001;


// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://stock-trading-2.onrender.com/login'
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled with the same CORS config
app.options('*', cors(corsOptions));

// Log incoming origins
app.use((req, res, next) => {
  console.log(`Incoming request origin: ${req.headers.origin}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// In your backend
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  // Other error handling
});
// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-trading';
mongoose.connect(mongoURI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

// Core API routes
app.use("/api/stocks", stockRoutes);
app.use("/api/users", userRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/txn", txnRoutes);
app.use("/api/price", priceRoutes);


//AI Routes
app.post('/api/ai/chat', authenticateToken, aiController.chat);
app.post('/api/ai/analyze-portfolio', authenticateToken, aiController.analyzePortfolio);

//Stock Routes
app.get('/api/stocks/realtime/:symbol', authenticateToken, stockController.getRealTimeQuote);
app.post('/api/stocks/realtime/multiple', authenticateToken, stockController.getMultipleRealTimeQuotes);
app.get('/api/stocks/search/:keywords', authenticateToken, stockController.searchStocks);
// Add to your main server file
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Consider graceful shutdown and restart
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Start server
app.listen(port, () => {
  console.log(` Server is running on http://localhost:${port}`);
});
