const db = require('../models/db');
const updateActualSpending = require('../utils/updateActualSpending');
const updateChallengeStatuses = require('../utils/updateChallengeStatuses');
const awardBadges = require('../utils/awardBadges');

exports.createExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  const userId = req.user.id;
  try {
    await db.query(
      'INSERT INTO expenses (user_id, amount, category, date, description) VALUES (?, ?, ?, ?, ?)',
      [userId, amount, category, date, description]
    );

    await updateActualSpending();
    await updateChallengeStatuses();
    await awardBadges(userId);

    res.status(201).json({ message: 'Expense registered and challenges updated successfully' });
  } catch (err) {
    console.error('❌ Failed to fetch expenses', err);
    res.status(500).json({ error: 'Failed to register expense', detail: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query; // ?month=2025-05

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