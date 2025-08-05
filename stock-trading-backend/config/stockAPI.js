// config/stockAPI.js
const axios = require('axios');

const API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE_URL = 'https://api.twelvedata.com';

const StockDataService = {
  getQuote: async (symbol) => {
    const url = `${BASE_URL}/quote?symbol=${symbol}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  },

  getMultipleQuotes: async (symbols) => {
    const joined = symbols.join(',');
    const url = `${BASE_URL}/quote?symbol=${joined}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  },

  searchStocks: async (keywords) => {
    const url = `${BASE_URL}/symbol_search?symbol=${keywords}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  }
};

module.exports = StockDataService;
