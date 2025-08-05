const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const createTradingAssistant = async (message, userPortfolio, userBalance) => {
  try {
    const contextPrompt = `
    User's Trading Context:
    - Balance: $${userBalance}
    - Portfolio: ${JSON.stringify(userPortfolio)}
    
    User Question: ${message}
    
    Provide helpful, educational trading guidance. Keep it concise and educational.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful trading education assistant. Provide guidance for learning trading concepts. Always mention this is for educational purposes only."
        },
        {
          role: "user",
          content: contextPrompt
        }
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
};

module.exports = { openai, createTradingAssistant };
