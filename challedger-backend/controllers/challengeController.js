const db = require('../models/db');
const { grantBadge, hasCompletedAnyChallenge } = require('../models/badgeModel');

// Mark a challenge as completed
exports.completeChallenge = async (req, res) => {
  const { challengeId } = req.params;
  const userId = req.user.id;

  try {
    await pool.execute(`UPDATE challenges SET status = 'Completed' WHERE id = ? AND user_id = ?`, [challengeId, userId]);

    res.json({ success: true, message: 'Challenge marked as completed.' });
  } catch (err) {
    console.error('❌ Error marking challenge as completed:', err);
    res.status(500).json({ error: 'Failed to mark challenge as completed', detail: err.message });
  }
};

// Create a new challenge for the user
exports.createChallenge = async (req, res) => {
  const { title, category, goal_amount, start_date, end_date } = req.body;
  const userId = req.user.id;

  try {
    await db.query(
      `INSERT INTO challenges (user_id, title, category, goal_amount, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, category, goal_amount, start_date, end_date]
    );
    res.status(201).json({ message: 'Challenge created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create challenge', detail: err.message });
  }
};

// Get only current (ongoing) challenges
exports.getCurrentChallenges = async (req, res) => {
  const userId = req.user.id;

  // Get today's date in YYYY-MM-DD format
  const todayObj = new Date();
  const yyyy = todayObj.getFullYear();
  const mm = String(todayObj.getMonth() + 1).padStart(2, '0');
  const dd = String(todayObj.getDate()).padStart(2, '0');
  const today = `${yyyy}-${mm}-${dd}`;

  try {
    const [challengeRows] = await db.query(
      `SELECT * FROM challenges
       WHERE user_id = ? AND start_date <= ? AND end_date >= ?
       ORDER BY start_date DESC`,
      [userId, today, today]
    );

    // Calculate actual spending for each challenge
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
    res.status(500).json({ error: 'Failed to fetch current challenges', detail: err.message });
  }
};

// Get progress info (percent spent) for current challenges
exports.getChallengeProgresses = async (req, res) => {
  const userId = req.user.id;
  const todayObj = new Date();
  const yyyy = todayObj.getFullYear();
  const mm = String(todayObj.getMonth() + 1).padStart(2, '0');
  const dd = String(todayObj.getDate()).padStart(2, '0');
  const today = `${yyyy}-${mm}-${dd}`;

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
    res.status(500).json({ error: 'Failed to calculate challenge progress', detail: err.message });
  }
};

// Get all challenges + progress + status (success/fail/in-progress)
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
    res.status(500).json({ error: 'Failed to fetch all challenges', detail: err.message });
  }
};