const pool = require('./db'); // MySQL 연결 풀

// 유저가 완료한 챌린지가 한 개라도 있는지 확인
async function hasCompletedAnyChallenge(userId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM challenges WHERE user_id = ? AND status = 'Completed'`,
    [userId]
  );
  return rows[0].count > 0;
}

// 배지를 지급 (이미 있으면 무시)
async function grantBadge(userId, badgeName) {
  const [existing] = await pool.query(
    `SELECT * FROM badges WHERE user_id = ? AND badge_name = ?`,
    [userId, badgeName]
  );

  if (existing.length === 0) {
    await pool.query(
      `INSERT INTO badges (user_id, badge_name) VALUES (?, ?)`,
      [userId, badgeName]
    );
  } else {
    console.log(`ℹ️ Badge '${badgeName}' already exists for user ${userId}`);
  }
}

module.exports = {
  hasCompletedAnyChallenge,
  grantBadge
};