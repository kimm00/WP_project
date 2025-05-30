const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const challengeController = require('../controllers/challengeController');

router.post('/', auth, challengeController.createChallenge);
router.get('/', auth, challengeController.getAllChallengesWithProgress);
router.get('/current', auth, challengeController.getCurrentChallenges);
router.get('/progress', auth, challengeController.getChallengeProgresses);

module.exports = router;