const db = require('../models/db');

exports.createExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  const userId = req.user.id; // JWT로부터 받은 사용자 ID
  try {
    await db.query(
      'INSERT INTO expenses (user_id, amount, category, date, description) VALUES (?, ?, ?, ?, ?)',
      [userId, amount, category, date, description]
    );
    res.status(201).json({ message: '소비 등록 완료' });
  } catch (err) {
    res.status(500).json({ error: '소비 등록 실패', detail: err.message });
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
    res.status(500).json({ error: '소비 내역 조회 실패', detail: err.message });
  }
};