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
      'INSERT INTO expenses (user_id, amount, category, date, description) VALUES (?, ?, ?, ?, ?)',
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

// Get all expenses for the given month
exports.getExpenses = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query; 

  try {
    const [rows] = await db.query(
      'SELECT * FROM expenses WHERE user_id = ? AND DATE_FORMAT(date, "%Y-%m") = ? ORDER BY date DESC',
      [userId, month]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses', detail: err.message });
  }
};