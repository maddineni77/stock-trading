const { createTradingAssistant } = require('../config/openai');
const User = require('../models/user');

const aiController = {
  // AI Chat endpoint
  async chat(req, res) {
    try {
      const { message } = req.body;
      const userId = req.user.id; // From your auth middleware

      if (!message) {
        return res.status(400).json({
          success: false,
          error: 'Message is required'
        });
      }

      // Get user's portfolio and balance
      const user = await User.findById(userId).populate('portfolio');
      
      const aiResponse = await createTradingAssistant(
        message, 
        user.portfolio || [], 
        user.balance || 0
      );

      res.json({
        success: true,
        response: aiResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI Chat Error:', error);
      res.status(500).json({
        success: false,
        error: 'AI service temporarily unavailable'
      });
    }
  },

  // Portfolio Analysis
  async analyzePortfolio(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate('portfolio');

      if (!user.portfolio || user.portfolio.length === 0) {
        return res.json({
          success: true,
          analysis: "You don't have any holdings yet. Start by buying some stocks to build your portfolio!"
        });
      }

      const portfolioSummary = {
        totalValue: user.portfolioValue || 0,
        holdings: user.portfolio.length,
        riskLevel: user.riskTolerance || 'moderate'
      };

      const analysisPrompt = `Analyze this portfolio: ${JSON.stringify(portfolioSummary)}. Provide brief educational insights on diversification and risk.`;
      
      const analysis = await createTradingAssistant(analysisPrompt, user.portfolio, user.balance);

      res.json({
        success: true,
        analysis: analysis
      });

    } catch (error) {
      console.error('Portfolio Analysis Error:', error);
      res.status(500).json({
        success: false,
        error: 'Analysis service unavailable'
      });
    }
  }
};

module.exports = aiController;
