const pool = require('./db');

async function hasCompletedAnyChallenge(userId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM challenges WHERE user_id = ? AND status = 'Completed'`,
    [userId]
  );
  return rows[0].count > 0;
}

async function hasBadge(userId, badgeName) {
  const [rows] = await pool.query(
    `SELECT 1 FROM badges WHERE user_id = ? AND badge_name = ? LIMIT 1`,
    [userId, badgeName]
  );
  return rows.length > 0;
}

async function grantBadge(userId, badgeName) {
  const [existing] = await pool.query(
    `SELECT * FROM badges WHERE user_id = ? AND badge_name = ?`,
    [userId, badgeName]
  );

  console.log('🔍 badge 존재 여부:', existing);

  if (existing.length === 0) {
    await pool.query(
      `INSERT INTO badges (user_id, badge_name) VALUES (?, ?)`,
      [userId, badgeName]
    );
    console.log('✅ 배지 INSERT 완료:', badgeName);
  } else {
    console.log('⚠️ 배지 이미 존재함:', badgeName);
  }
}

module.exports = {
  hasCompletedAnyChallenge,
  hasBadge,
  grantBadge
};