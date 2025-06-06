const db = require('../models/db');
const updateActualSpending = require('../utils/updateActualSpending');
const updateChallengeStatuses = require('../utils/updateChallengeStatuses');
const awardBadges = require('../utils/awardBadges');

// Register a new expense and update related challenge data
exports.createExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  const userId = req.user.id;
  try {
    // Insert new expense record
    await db.query(
      'INSERT INTO expenses (user_id, amount, category, date, description) VALUES ($1, $2, $3, $4, $5)',
      [userId, amount, category, date, description]
    );

    await updateActualSpending();  // Update actual_spending field for challenges
    await updateChallengeStatuses();  // Update challenge statuses (In Progress / Success / Fail)
    await awardBadges(userId);  // Award badges if eligible

    res.status(201).json({ message: 'Expense registered and challenges updated successfully' });
  } catch (err) {
    console.error('❌ Failed to fetch expenses', err);
    res.status(500).json({ error: 'Failed to register expense', detail: err.message });
  }
};

// Retrieve all expenses
exports.getAllExpenses = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      `SELECT * FROM expenses 
       WHERE user_id = $1 
       ORDER BY date DESC`,
      [userId]
    );
    // Return the list of expenses as JSON
    res.json(result.rows);
  } catch (err) {
    // Handle any errors during the database query
    res.status(500).json({ error: 'Failed to fetch expenses', detail: err.message });
  }
};

// Retrieve expenses for the specified month
exports.getMonthlyExpenses = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query; // Expected format: 'YYYY-MM'

  try {
    const result = await db.query(
      `SELECT * FROM expenses 
       WHERE user_id = $1 AND TO_CHAR(date, 'YYYY-MM') = $2 
       ORDER BY date DESC`,
      [userId, month]
    );

    // Return the list of expenses as JSON
    res.json(result.rows);
  } catch (err) {
    // Handle any errors during the database query
    res.status(500).json({ error: 'Failed to fetch expenses', detail: err.message });
  }
};

// Delete a specific expense and update related challenge data
exports.deleteExpense = async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;

  try {
    // Delete the expense only if it belongs to the current user
    const result = await db.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
      [expenseId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Expense not found or not authorized' });
    }

    // After deletion, update related challenge and badge data
    await updateActualSpending();        // Recalculate actual_spending for all challenges
    await updateChallengeStatuses();     // Refresh challenge statuses (e.g., In Progress, Success, Fail)
    await awardBadges(userId);           // Re-evaluate and award badges if needed

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('❌ Failed to delete expense', err);
    res.status(500).json({ error: 'Failed to delete expense', detail: err.message });
  }
};