const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

router.post('/', auth, expenseController.createExpense); // 소비 등록
router.get('/', auth, expenseController.getExpenses);    // 소비 조회

module.exports = router;