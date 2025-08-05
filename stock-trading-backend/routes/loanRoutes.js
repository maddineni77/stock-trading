const express = require('express');
const router = express.Router();
const {
  takeLoan,
  repayLoan,
  getLoanStatus
} = require('../controllers/loanController');

router.post('/take', takeLoan);
router.post('/repay', repayLoan);
router.get('/:userId', getLoanStatus);

module.exports = router;
