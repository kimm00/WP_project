const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const challengeController = require('../controllers/challengeController');

router.post('/', auth, challengeController.createChallenge);
router.get('/current', auth, challengeController.getCurrentChallenges);
router.get('/progress', auth, challengeController.getChallengeProgresses);
router.get('/all', auth, challengeController.getAllChallengesWithProgress);

module.exports = router;