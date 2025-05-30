const pool = require('../models/db');

exports.getUserBadges = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT badge_name, awarded_at FROM badges WHERE user_id = ?`,
      [userId]
    );
    res.json({ badges: rows });
  } catch (err) {
    console.error('❌ 배지 조회 실패:', err);
    res.status(500).json({ error: '배지 조회 실패', detail: err.message });
  }
};