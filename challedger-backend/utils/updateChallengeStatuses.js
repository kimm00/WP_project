const db = require('../models/db');
const { awardBadges } = require('./awardBadges');

async function updateChallengeStatuses() {
  try {
    // Fetch all challenges
    const [challenges] = await db.query(`SELECT * FROM challenges`);
    const updatedUserIds = new Set();

    for (const ch of challenges) {
      // Calculate total expenses for the challenge
      const [rows] = await db.query(
        `SELECT SUM(amount) AS total FROM expenses 
         WHERE user_id = ? AND category = ? 
         AND date BETWEEN ? AND ?`,
        [ch.user_id, ch.category, ch.start_date, ch.end_date]
      );

      const actual = Number(rows[0].total || 0);
      const goal = Number(ch.goal_amount) || 1;

      // Check if challenge period has ended
      const now = new Date();
      const endDate = new Date(ch.end_date);
      let status = 'In Progress';

      // Update status based on spending vs goal
      if (now > endDate) {
        status = actual <= goal ? 'Success' : 'Fail';
      }

      // Update challenge status in DB
      await db.query(
        `UPDATE challenges SET status = ? WHERE id = ?`,
        [status, ch.id]
      );

      console.log(`✅ Challenge ID ${ch.id} status updated to: ${status}`);

      updatedUserIds.add(ch.user_id);  // Track users whose badges may need to be updated
    }

    // Update challenge status in DB
    for (const userId of updatedUserIds) {
        await awardBadges(userId);
    }

    console.log('\n🎉 All challenge statuses updated successfully!');
  } catch (err) {
    console.error('❌ Error updating challenge statuses:', err);
  }
}

module.exports = updateChallengeStatuses;