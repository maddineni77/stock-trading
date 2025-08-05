# Stock Trading Application - Setup Guide

## Prerequisites
- Node.js installed
- MongoDB installed
- Git installed

## Backend Setup

### 1. Start MongoDB
First, ensure MongoDB is running:

#### Option A: Windows Service (Requires Admin)
```cmd
net start MongoDB
```

#### Option B: Manual Start
```cmd
mongod --dbpath "C:\data\db"
```

#### Option C: Use the provided script
Double-click `start-mongodb.bat` in the backend folder

### 2. Install Backend Dependencies
```cmd
cd stock-trading-backend
npm install
```

### 3. Configure Environment
The `.env` file is already configured with:
```
MONGODB_URI="mongodb://localhost:27017/stocks"
PORT=5000
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
```

### 4. Start Backend Server
```cmd
# Development mode with auto-restart
npm run dev

# Or production mode
npm start

# Or use the batch file
start-server.bat
```

The server will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Frontend Dependencies
```cmd
cd stock-trading-frontend/stock-trading
npm install
```

### 2. Start Frontend Development Server
```cmd
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Integration

### Authentication Features
- **User Registration**: POST `/users/register`
  - Requires: username, email, password
  - Returns: user data + JWT token
  - Password is hashed with bcrypt

- **User Login**: POST `/users/login`
  - Requires: email, password
  - Returns: user data + JWT token

### API Endpoints
- **Stocks**: `/stocks/*`
- **Users**: `/users/*`
- **Loans**: `/loan/*`
- **Transactions**: `/txn/*`
- **Prices**: `/price/*`

### Security Features
- JWT token authentication
- Password hashing with bcrypt
- Automatic token management in frontend
- Token expiration handling

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  balance: Number (default: 10000),
  loanAmount: Number (default: 0),
  portfolio: [Array of stock holdings],
  role: String (default: 'user')
}
```

## Testing the Integration

1. Start MongoDB
2. Start the backend server
3. Start the frontend development server
4. Navigate to the registration page
5. Register a new user
6. Login with the created user

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check if the data directory exists: `C:\data\db`
- Verify the MONGODB_URI in `.env`

### Backend Server Issues
- Check if port 5000 is available
- Verify all dependencies are installed
- Check the console for error messages

### Frontend Integration Issues
- Verify the API_BASE_URL in `src/services/api.js`
- Check browser console for errors
- Ensure CORS is properly configured

### Registration/Login Issues
- Check if the request is reaching the backend
- Verify password meets minimum requirements (6+ characters)
- Check for duplicate email/username errors

## Next Steps

1. Implement protected routes with authentication
2. Add role-based access control
3. Implement real-time stock price updates
4. Add transaction history and reporting
5. Implement loan management features

## Development Commands

### Backend
```cmd
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend
```cmd
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```
