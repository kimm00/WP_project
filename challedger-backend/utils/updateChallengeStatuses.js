const db = require('../models/db');
const { awardBadges } = require('./awardBadges');

async function updateChallengeStatuses() {
  try {
    const [challenges] = await db.query(`SELECT * FROM challenges`);
    const updatedUserIds = new Set();

    for (const ch of challenges) {
      const [rows] = await db.query(
        `SELECT SUM(amount) AS total FROM expenses 
         WHERE user_id = ? AND category = ? 
         AND date BETWEEN ? AND ?`,
        [ch.user_id, ch.category, ch.start_date, ch.end_date]
      );

      const actual = Number(rows[0].total || 0);
      const goal = Number(ch.goal_amount) || 1;

      const now = new Date();
      const endDate = new Date(ch.end_date);
      let status = 'In Progress';

      if (now > endDate) {
        status = actual <= goal ? 'Success' : 'Fail';
      }

      await db.query(
        `UPDATE challenges SET status = ? WHERE id = ?`,
        [status, ch.id]
      );

      console.log(`✅ Challenge ID ${ch.id} status updated to: ${status}`);

      updatedUserIds.add(ch.user_id);
    }

    // 유저별 한 번만 awardBadges 호출
    for (const userId of updatedUserIds) {
        await awardBadges(userId);
    }

    console.log('\n🎉 All challenge statuses updated successfully!');
  } catch (err) {
    console.error('❌ Error updating challenge statuses:', err);
  }
}

updateChallengeStatuses();