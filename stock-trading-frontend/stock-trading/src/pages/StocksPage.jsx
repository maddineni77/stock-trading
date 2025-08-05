import { useState,useEffect } from 'react';
import StockRegistration from '../components/StockRegistration';
import StockHistory from '../components/StockHistory';
import {  realTimeStockAPI } from '../services/api';
import StockSearch from '../components/StockSearch';
const StocksPage = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [realTimeData, setRealTimeData] = useState({});
const [symbols, setSymbols] = useState(['AAPL', 'GOOGL', 'MSFT']); // Example symbols
const fetchRealTimeData = async (symbolsList) => {
  try {
    const response = await realTimeStockAPI.getMultipleRealTimeQuotes(symbolsList);
    
    if (!response?.success || !response?.data) {
      throw new Error('Invalid API response structure');
    }

    const dataMap = {};
    
    // Handle both array and object responses
    if (Array.isArray(response.data)) {
      response.data.forEach(stock => {
        dataMap[stock.symbol] = stock;
      });
    } else if (typeof response.data === 'object') {
      // If data is an object with symbol keys
      Object.entries(response.data).forEach(([symbol, stockData]) => {
        dataMap[symbol] = stockData;
      });
    }
    
    setRealTimeData(dataMap);
  } catch (error) {
    console.error('Failed to fetch real-time data:', error);
    setRealTimeData({}); // Reset to empty object on error
  }
};


const handleSearch = (keyword) => {
  if (keyword) {
    setSymbols([keyword.toUpperCase()]);
  }
};

useEffect(() => {
  fetchRealTimeData(symbols);
}, [symbols]);


  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Stock History & Prices
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'register'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Register New Stock
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'history' && (
  <div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Stock Price History</h2>
      <p className="text-gray-600">View real-time stock prices and historical data</p>
    </div>

    {/* 🔍 Stock Search */}
    <StockSearch onSearch={handleSearch} />

    {/* 📈 Real-time Data Display */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {Object.keys(realTimeData).length === 0 ? (
        <p className="text-gray-500">No real-time data available</p>
      ) : (
        Object.values(realTimeData).map((stock) => (
          <div key={stock.symbol} className="bg-white border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{stock.symbol}</h3>
            <p>Price: ${stock.price}</p>
            <p>Change: {stock.change} ({stock.changePercent}%)</p>
          </div>
        ))
      )}
    </div>

    {/* 📜 Historical Data Component */}
    <div className="mt-6">
      <StockHistory />
    </div>
  </div>
)}


          {activeTab === 'register' && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Register New Stock</h2>
                <p className="text-gray-600">Add a new stock to the trading system</p>
              </div>
              <StockRegistration />
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
};

export default StocksPage;
