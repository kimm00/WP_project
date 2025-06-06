const pool = require('./db');

// Check if user has completed at least one challenge
async function hasCompletedAnyChallenge(userId) {
  const result = await pool.query(
    `SELECT COUNT(*) AS count FROM challenges WHERE user_id = $1 AND status = 'Completed'`,
    [userId]
  );
  return Number(result.rows[0].count) > 0;
}

// Check if user already has the given badge
async function hasBadge(userId, badgeName) {
  const result = await pool.query(
    `SELECT 1 FROM badges WHERE user_id = $1 AND badge_name = $2 LIMIT 1`,
    [userId, badgeName]
  );
  return result.rows.length > 0;
}

// Grant badge to user if they don't already have it
async function grantBadge(userId, badgeName) {
  const result = await pool.query(
    `SELECT * FROM badges WHERE user_id = $1 AND badge_name = $2`,
    [userId, badgeName]
  );

  console.log('🔍 badge 존재 여부:', result.rows);

  if (result.rows.length === 0) {
    await pool.query(
      `INSERT INTO badges (user_id, badge_name) VALUES ($1, $2)`,
      [userId, badgeName]
    );
  } else {
    console.log(`ℹ️ Badge '${badgeName}' already exists for user ${userId}`);
  }
}

module.exports = {
  hasCompletedAnyChallenge,
  hasBadge,
  grantBadge
};