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
    console.error('❌ Failed to retrieve badges:', err);
    res.status(500).json({ error: 'Failed to retrieve badges', detail: err.message });
  }
};