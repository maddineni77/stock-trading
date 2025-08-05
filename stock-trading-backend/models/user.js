const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    required: true,
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  balance: { type: Number, default: 10000 },
  loanAmount: { type: Number, default: 0 },
  portfolio: [{
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
    quantity: Number,
    buyPrice: Number
  }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
