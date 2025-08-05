const express = require('express');
const router = express.Router();
const {
  buyStock,
  sellStock,
  getUserTransactions
} = require('../controllers/txnController');

router.post('/buy', buyStock);
router.post('/sell', sellStock);
router.get('/:userId', getUserTransactions);

module.exports = router;
