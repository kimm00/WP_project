const pool = require('../models/db');

// Controller: Get badges for the authenticated user
exports.getUserBadges = async (req, res) => {
  const userId = req.user.id;  // Extract user ID from authenticated request

  try {
    // Query badges associated with the current user
    const result = await pool.query(
      `SELECT badge_name, awarded_at FROM badges WHERE user_id = $1`,
      [userId]
    );
    // Send badge list to client
    res.json({ badges: result.rows });
  } catch (err) {
    console.error('❌ Failed to retrieve badges:', err);
    res.status(500).json({ error: 'Failed to retrieve badges', detail: err.message });
  }
};