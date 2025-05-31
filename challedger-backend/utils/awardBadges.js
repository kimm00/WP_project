// utils/awardBadges.js
const db = require('../models/db');
const { grantBadge } = require('../models/badgeModel');

// 새로운 배지 부여 로직
const awardBadges = async (userId) => {
  try {
    // 1. First Challenge - 챌린지를 1개 이상 등록했을 때
    const [[{ count: totalChallenges }]] = await db.query(
      `SELECT COUNT(*) AS count FROM challenges WHERE user_id = ?`,
      [userId]
    );
    if (totalChallenges >= 1) {
      await grantBadge(userId, 'First Challenge');
    }

    // 2. 3-Time Streak - 챌린지를 3개 이상 성공했을 때
    const [[{ count: successCount }]] = await db.query(
      `SELECT COUNT(*) AS count FROM challenges WHERE user_id = ? AND status = 'Success'`,
      [userId]
    );
    if (successCount >= 3) {
        await grantBadge(userId, '3-Time Streak');
    }
    // 3. Challenge Achiever - 첫 번째 성공한 챌린지를 만든 경우
    if (successCount >= 1) {
      await grantBadge(userId, 'Challenge Achiever');
    }

    // 4. Perfect Saver - actual_spending = 0 인 성공한 챌린지가 있을 때
    const [[{ count: perfectSaves }]] = await db.query(
      `SELECT COUNT(*) AS count FROM challenges 
       WHERE user_id = ? AND status = 'Success' AND actual_spending = 0`,
      [userId]
    );
    if (perfectSaves >= 1) {
      await grantBadge(userId, 'Perfect Saver');
    }

    // 5. 최근 소비 5개가 모두 Food → Food Budget Destroyer
    const [[{ count: recentFoodCount }]] = await db.query(
        `SELECT COUNT(*) AS count FROM (
          SELECT category FROM expenses
          WHERE user_id = ?
          ORDER BY date DESC, id DESC
          LIMIT 5
        ) AS recent
        WHERE category = 'Food'`,
        [userId]
    );
    if (recentFoodCount.count === 5) {
        await grantBadge(userId, 'Food Budget Destroyer');
    }

    // 6. 최근 소비 3개가 모두 5000원 이하 → Savings Superstar
    const [[{ count: smallExpenses }]] = await db.query(
        `SELECT COUNT(*) AS count FROM (
          SELECT amount FROM expenses
          WHERE user_id = ?
          ORDER BY date DESC, id DESC
          LIMIT 3
        ) AS recent
        WHERE amount <= 5000`,
        [userId]
    );
    if (smallExpenses.count === 3){
        await grantBadge(userId, 'Savings Superstar');
    }
    
    // 5. 카테고리 기반 배지 (최소 5회 소비 시 지급)
    const categoryBadges = {
        'Transport': 'Transport Tracker',
        'Shopping': 'Shopping Spree',
        'Entertainment': 'Entertainment Lover',
        'Health': 'Health First',
        'Travel': 'Travel Budgeter',
        'Education': 'Lifelong Learner',
        'Bills': 'Bill Payer',
        'Pets': 'Pet Lover',
        'Gifts': 'Gift Giver',
        'Others': 'Explorer',
        'Cafe': 'Cafe Enthusiast',
        'Daily': 'Everyday Essentials'
    };

    const counts = {};

    for (const category of Object.keys(categoryBadges)) {
        const [[{ count }]] = await db.query(
            `SELECT COUNT(*) AS count FROM expenses WHERE user_id = ? AND category = ?`,
            [userId, category]
        );
        counts[category] = count;
    }

    if (counts['Cafe'] >= 3) await grantBadge(userId, 'Cafe Enthusiast');
    if (counts['Daily'] >= 5) await grantBadge(userId, 'Everyday Essentials');
    if (counts['Transport'] >= 3) await grantBadge(userId, 'Transport Tracker');
    if (counts['Shopping'] >= 2) await grantBadge(userId, 'Shopping Spree');
    if (counts['Entertainment'] >= 3) await grantBadge(userId, 'Entertainment Lover');
    if (counts['Health'] >= 2) await grantBadge(userId, 'Health First');
    if (counts['Travel'] >= 1) await grantBadge(userId, 'Travel Budgeter');
    if (counts['Education'] >= 1) await grantBadge(userId, 'Lifelong Learner');
    if (counts['Bills'] >= 2) await grantBadge(userId, 'Bill Payer');
    if (counts['Pets'] >= 2) await grantBadge(userId, 'Pet Lover');
    if (counts['Gifts'] >= 1) await grantBadge(userId, 'Gift Giver');
    if (counts['Others'] >= 4) await grantBadge(userId, 'Explorer');

  } catch (err) {
    console.error('❌ Error while awarding badges:', err);
  }
};

module.exports = awardBadges;