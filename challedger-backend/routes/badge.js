const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const auth = require('../middleware/auth'); // 인증 미들웨어

// ✅ 유저가 가진 뱃지 목록 조회
router.get('/', auth, badgeController.getUserBadges);

module.exports = router;