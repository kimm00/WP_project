const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');  // 🔒 Middleware to verify JWT token
const challengeController = require('../controllers/challengeController');

router.post('/', auth, challengeController.createChallenge);  // Create a new challenge
router.get('/current', auth, challengeController.getCurrentChallenges);  // Get current (ongoing) challenges
router.get('/progress', auth, challengeController.getChallengeProgresses);  // Get progress for current challenges
router.get('/all', auth, challengeController.getAllChallengesWithProgress);  // Get all challenges with progress and status
router.post('/complete/:challengeId', auth, challengeController.completeChallenge);  // Mark a challenge as completed manually

// Export the router to be used in the app
module.exports = router;