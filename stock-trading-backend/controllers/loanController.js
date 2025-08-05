const Loan = require('../models/loan');
const User = require('../models/user');

const takeLoan = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const interestRate = 0.1;
    const totalRepay = amount + amount * interestRate;

    const existingLoan = await Loan.findOne({ userId, isRepaid: false });
    if (existingLoan) {
      return res.status(400).json({ message: 'Repay existing loan before taking a new one' });
    }

    const loan = new Loan({ userId, amount, interestRate, totalRepay });
    await loan.save();

    const user = await User.findById(userId);
    user.balance += amount;
    await user.save();

    res.json({ message: 'Loan granted', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Loan request failed', error: err.message });
  }
};
const repayLoan = async (req, res) => {
  try {
    const { userId } = req.body;

    const loan = await Loan.findOne({ userId, isRepaid: false });
    if (!loan) return res.status(404).json({ message: 'No active loan to repay' });

    const user = await User.findById(userId);
    if (user.balance < loan.totalRepay) {
      return res.status(400).json({ message: 'Insufficient balance to repay loan' });
    }

    user.balance -= loan.totalRepay;
    await user.save();

    loan.isRepaid = true;
    await loan.save();

    res.json({ message: 'Loan repaid successfully', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Loan repayment failed', error: err.message });
  }
};
const getLoanStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const loan = await Loan.findOne({ userId, isRepaid: false });

    if (!loan) {
      return res.json({ hasLoan: false, message: 'No active loan' });
    }

    res.json({
      hasLoan: true,
      amount: loan.amount,
      interestRate: loan.interestRate,
      totalRepay: loan.totalRepay,
      createdAt: loan.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get loan status', error: err.message });
  }
};
module.exports={getLoanStatus,repayLoan,takeLoan}
