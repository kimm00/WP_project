const db = require('../models/db');
const updateActualSpending = require('../utils/updateActualSpending');
const updateChallengeStatuses = require('../utils/updateChallengeStatuses');
const awardBadges = require('../utils/awardBadges');

exports.createExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  const userId = req.user.id; // JWT로부터 받은 사용자 ID
  try {
    await db.query(
      'INSERT INTO expenses (user_id, amount, category, date, description) VALUES (?, ?, ?, ?, ?)',
      [userId, amount, category, date, description]
    );

    // 소비 등록 후 챌린지 상태 및 금액 자동 업데이트
    await updateActualSpending();
    await updateChallengeStatuses();

    // 배지 자동 지급
    await awardBadges(userId);

    res.status(201).json({ message: '소비 등록 및 챌린지 업데이트 완료' });
  } catch (err) {
    console.error('❌ 소비 등록 중 오류:', err);
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