# Stock Trading System - Setup Guide

## Overview
This is a full-stack stock trading application with React frontend and Node.js/Express backend, featuring real-time stock data, AI assistant, and portfolio management.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Environment Setup

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd stock-trading-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/stock-trading

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# OpenAI Configuration (Optional - for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Stock API Configuration (Optional - for real-time data)
TWELVE_DATA_API_KEY=your_twelve_data_api_key_here

# Server Configuration
PORT=5001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

4. Start MongoDB (if running locally):
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

5. Start the backend server:
```bash
npm start
# or for development with auto-restart
npm run dev
```

The backend will be available at `http://localhost:5001`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd stock-trading-frontend/stock-trading
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Features

### ✅ Working Features
- User authentication (login/register)
- Dashboard with portfolio overview
- Stock registration and management
- Real-time stock data (with API key)
- AI trading assistant (with OpenAI API key)
- Portfolio tracking
- Transaction history
- Loan management
- Responsive design

### 🔧 Demo Credentials
- **User**: demo@user.com / demo123
- **Admin**: admin@stock.com / admin123

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Stocks
- `GET /api/stocks` - Get all stocks
- `POST /api/stocks/register` - Register new stock
- `GET /api/stocks/history` - Get stock price history
- `GET /api/stocks/report` - Get stock report
- `GET /api/stocks/top` - Get top performing stocks

### Real-time Data
- `GET /api/stocks/realtime/:symbol` - Get real-time quote
- `POST /api/stocks/realtime/multiple` - Get multiple quotes
- `GET /api/stocks/search/:keywords` - Search stocks

### Transactions
- `POST /api/txn/buy` - Buy stocks
- `POST /api/txn/sell` - Sell stocks
- `GET /api/txn/:userId` - Get user transactions

### Loans
- `POST /api/loan/take` - Take a loan
- `POST /api/loan/repay` - Repay loan
- `GET /api/loan/:userId` - Get loan status

### AI Assistant
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/analyze-portfolio` - Analyze portfolio

## Database Models

### User
- username, email, password
- userType (user/admin)
- balance, loanAmount
- portfolio (array of stock holdings)

### Stock
- name, symbol
- currentPrice, availableQuantity

### Transaction
- userId, stockId, quantity, price
- type (buy/sell), timestamp

### Loan
- userId, amount, interestRate
- totalRepay, isRepaid

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in .env file
   - Default: `mongodb://localhost:27017/stock-trading`

2. **CORS Errors**
   - Backend is configured for `http://localhost:5173`
   - Check if frontend is running on correct port

3. **API Key Errors**
   - Real-time stock data requires TWELVE_DATA_API_KEY
   - AI features require OPENAI_API_KEY
   - Both are optional - app works without them

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend .env
   - Use demo credentials for testing

### Development Tips

1. **Backend Development**
   - Use `npm run dev` for auto-restart
   - Check console for MongoDB connection status
   - API responses include success/error indicators

2. **Frontend Development**
   - Hot reload enabled with Vite
   - Check browser console for API errors
   - Use React DevTools for state debugging

3. **Database Management**
   - Use MongoDB Compass for GUI
   - Collections: users, stocks, transactions, loans, prices

## Production Deployment

### Backend
1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Configure production MongoDB URI
4. Set up proper CORS origins

### Frontend
1. Run `npm run build`
2. Serve dist folder with web server
3. Update API_BASE_URL in production

## Security Notes

- Change default JWT secret in production
- Use environment variables for sensitive data
- Implement proper input validation
- Add rate limiting for API endpoints
- Use HTTPS in production

## Support

For issues or questions:
1. Check the console logs
2. Verify environment variables
3. Test with demo credentials
4. Check MongoDB connection status

## License

This project is for educational purposes only.