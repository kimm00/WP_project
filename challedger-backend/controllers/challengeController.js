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

exports.getCurrentChallenges = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    const [challengeRows] = await db.query(
      `SELECT * FROM challenges
       WHERE user_id = ? AND start_date <= ? AND end_date >= ?
       ORDER BY start_date DESC`,
      [userId, today, today]
    );

    const enhanced = await Promise.all(
      challengeRows.map(async (ch) => {
        const [spendingRows] = await db.query(
          `SELECT SUM(amount) AS total FROM expenses
           WHERE user_id = ? AND category = ? AND DATE(date) BETWEEN DATE(?) AND DATE(?)`,
          [userId, ch.category, ch.start_date, ch.end_date]
        );

        const actual = Number(spendingRows[0].total || 0);

        return {
          ...ch,
          actual_spending: actual,
        };
      })
    );

    res.json(enhanced);
  } catch (err) {
    res.status(500).json({ error: '진행 중 챌린지 목록 조회 실패', detail: err.message });
  }
};

exports.getChallengeProgresses = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const [challengeRows] = await db.query(
      `SELECT * FROM challenges
       WHERE user_id = ? AND start_date <= ? AND end_date >= ?
       ORDER BY start_date DESC`,
      [userId, today, today]
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
          id: ch.id,
          title: ch.title,
          category: ch.category,
          goalAmount: goal,
          actualSpending: actual,
          percent: progress,
          isExceeded: actual > goal
        };
      })
    );

    res.json(enhanced);
  } catch (err) {
    res.status(500).json({ error: '진행률 목록 계산 실패', detail: err.message });
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

        const now = new Date();
        const end = new Date(ch.end_date);

        let status = 'in-progress';
        if (actual >= goal) {
          status = 'success';
        } else if (now > end) {
          status = 'fail';
        }

        return {
          ...ch,
          actual_spending: actual,
          progress,
          status,
        };
      })
    );

    res.json(enhanced);
  } catch (err) {
    res.status(500).json({ error: '챌린지 전체 조회 실패', detail: err.message });
  }
};