const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');  // 🔒 JWT authentication middleware

router.post('/', auth, expenseController.createExpense); // Register a new expense
router.get('/', auth, expenseController.getExpenses);    // Get all expenses for a given month

// Export the router
module.exports = router;