const db = require('../models/db');

async function updateActualSpending() {
  try {
    // Fetch all challenges from the database
    const result = await db.query('SELECT * FROM challenges');
    const challenges = result.rows;

    // Iterate through each challenge to calculate actual spending
    for (const ch of challenges) {
      const spendResult = await db.query(
        `SELECT SUM(amount) AS total FROM expenses
         WHERE user_id = $1 AND category = $2 AND date BETWEEN $3 AND $4`,
        [ch.user_id, ch.category, ch.start_date, ch.end_date]
      );

      const actual = Number(spendResult.rows[0].total || 0);  // Get the total amount spent or default to 0

      // Update the actual_spending field for this challenge
      await db.query(
        `UPDATE challenges SET actual_spending = $1 WHERE id = $2`,
        [actual, ch.id]
      );

      console.log(`✅ Challenge ID ${ch.id} actual_spending updated to: ${actual} KRW`);
    }

    console.log('\n🎉 All actual spending values updated successfully!');
  } catch (err) {
    console.error('❌ Error updating actual spending:', err);
  }
}

module.exports = updateActualSpending;