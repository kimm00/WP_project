const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const auth = require('../middleware/auth'); // 🔒 Authentication middleware

// Route to get the list of badges owned by the user
router.get('/', auth, badgeController.getUserBadges);

// Export the router to be used in the main app
module.exports = router;