// Import the PostgreSQL connection pool
const pool = require('./db');

// Check if user has completed at least one challenge
async function hasCompletedAnyChallenge(userId) {
  const result = await pool.query(
    `SELECT COUNT(*) AS count FROM challenges WHERE user_id = $1 AND status = 'Completed'`,
    [userId]
  );
  // Return true if the user has completed at least one challenge
  return Number(result.rows[0].count) > 0;
}

// Check if user already has the given badge
async function hasBadge(userId, badgeName) {
  const result = await pool.query(
    `SELECT 1 FROM badges WHERE user_id = $1 AND badge_name = $2 LIMIT 1`,
    [userId, badgeName]
  );
  // Return true if the badge already exists for the user
  return result.rows.length > 0;
}

// Grant badge to user if they don't already have it
async function grantBadge(userId, badgeName) {
  const result = await pool.query(
    `SELECT * FROM badges WHERE user_id = $1 AND badge_name = $2`,
    [userId, badgeName]
  );

  console.log('🔍 Badge existence check:', result.rows);

  if (result.rows.length === 0) {
    // Insert the new badge into the badges table
    await pool.query(
      `INSERT INTO badges (user_id, badge_name) VALUES ($1, $2)`,
      [userId, badgeName]
    );
    return [badgeName];
  } else {
    console.log(`ℹ️ Badge '${badgeName}' already exists for user ${userId}`);
    return [];
  }
}

// Export the functions for use in other parts of the project
module.exports = {
  hasCompletedAnyChallenge,
  hasBadge,
  grantBadge
};