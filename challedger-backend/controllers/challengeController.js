const db = require('../models/db');

exports.createChallenge = async (req, res) => {
  const { title, category, goal_amount, start_date, end_date } = req.body;
  const userId = req.user.id;

  try {
    await db.query(
      `INSERT INTO challenges (user_id, title, category, goal_amount, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, category, goal_amount, start_date, end_date]
    );
    res.status(201).json({ message: '챌린지 등록 완료' });
  } catch (err) {
    res.status(500).json({ error: '챌린지 등록 실패', detail: err.message });
  }
};

exports.getCurrentChallenge = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    const [rows] = await db.query(
      `SELECT * FROM challenges
       WHERE user_id = ? AND start_date <= ? AND end_date >= ?
       ORDER BY start_date DESC LIMIT 1`,
      [userId, today, today]
    );
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: '챌린지 조회 실패', detail: err.message });
  }
};

exports.getChallengeProgress = async (req, res) => {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  
    try {
      // 1️⃣ 현재 진행 중인 챌린지 가져오기
      const [challengeRows] = await db.query(
        `SELECT * FROM challenges
         WHERE user_id = ? AND start_date <= ? AND end_date >= ?
         ORDER BY start_date DESC LIMIT 1`,
        [userId, today, today]
      );
  
      if (challengeRows.length === 0) {
        return res.status(404).json({ message: '진행 중인 챌린지가 없습니다.' });
      }
  
      const challenge = challengeRows[0];
  
      // 2️⃣ 해당 챌린지 카테고리의 실제 소비 금액 합산
      const [spendingRows] = await db.query(
        `SELECT SUM(amount) AS total FROM expenses
         WHERE user_id = ? AND category = ? AND date BETWEEN ? AND ?`,
        [userId, challenge.category, challenge.start_date, challenge.end_date]
      );
  
      const actualSpending = Number(spendingRows[0].total || 0);
      const goalAmount = Number(challenge.goal_amount);
      const percent = Math.min(Math.round((actualSpending / goalAmount) * 100), 100);
  
      res.json({
        category: challenge.category,
        goalAmount,
        actualSpending,
        percent,
        isExceeded: actualSpending > goalAmount,
      });
    } catch (err) {
      res.status(500).json({ error: '챌린지 진행률 계산 실패', detail: err.message });
    }
  };

  exports.getAllChallengesWithProgress = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const [challengeRows] = await db.query(
        `SELECT * FROM challenges WHERE user_id = ? ORDER BY start_date DESC`,
        [userId]
      );
  
      const enhanced = await Promise.all(
        challengeRows.map(async (ch) => {
          const [spendingRows] = await db.query(
            `SELECT SUM(amount) AS total FROM expenses
             WHERE user_id = ? AND category = ? AND date BETWEEN ? AND ?`,
            [userId, ch.category, ch.start_date, ch.end_date]
          );
  
          const actual = Number(spendingRows[0].total || 0);
          const goal = Number(ch.goal_amount) || 1;
          const progress = Math.min(Math.round((actual / goal) * 100), 100);
  
          return {
            ...ch,
            actual_spending: actual,
            progress,
          };
        })
      );
  
      res.json(enhanced);
    } catch (err) {
      res.status(500).json({ error: '챌린지 전체 조회 실패', detail: err.message });
    }
  };  