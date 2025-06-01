const db = require('../models/db');

async function updateActualSpending() {
  try {
    // Fetch all challenges from the database
    const [challenges] = await db.query('SELECT * FROM challenges');

    // Iterate through each challenge to calculate actual spending
    for (const ch of challenges) {
      const [rows] = await db.query(
        `SELECT SUM(amount) AS total FROM expenses
         WHERE user_id = ? AND category = ? AND date BETWEEN ? AND ?`,
        [ch.user_id, ch.category, ch.start_date, ch.end_date]
      );

      const actual = Number(rows[0].total || 0);  // Get the total amount spent or default to 0

      // Update the actual_spending field for this challenge
      await db.query(
        `UPDATE challenges SET actual_spending = ? WHERE id = ?`,
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