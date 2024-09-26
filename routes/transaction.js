const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { borrowMoney, repayMoney, allDebt, allTransaction, getDebts, getTransactions, addMoney } = require('../controllers/transaction');

// Register
router.post('/add-money', auth, addMoney);
router.post('/borrow', auth, borrowMoney);
router.post('/repay', auth, repayMoney);

router.get('/debts', auth, allDebt);
router.get('/debts/:userId', auth, getDebts);
router.get('/transactions', auth, allTransaction);
router.get('/transactions/:userId', auth, getTransactions);

module.exports = router;