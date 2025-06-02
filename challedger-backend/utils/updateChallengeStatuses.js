const db = require('../models/db');
const awardBadges = require('../utils/awardBadges');

async function updateChallengeStatuses() {
  try {
    // Fetch all challenges
    const result = await db.query(`SELECT * FROM challenges`);
    const challenges = result.rows;
    const updatedUserIds = new Set();

    for (const ch of challenges) {
      // Calculate total expenses for the challenge
      const spendResult = await db.query(
        `SELECT SUM(amount) AS total FROM expenses 
         WHERE user_id = $1 AND category = $2 
         AND date BETWEEN $3 AND $4`,
        [ch.user_id, ch.category, ch.start_date, ch.end_date]
      );

      const actual = Number(spendResult.rows[0].total || 0);
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
        `UPDATE challenges SET status = $1 WHERE id = $2`,
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