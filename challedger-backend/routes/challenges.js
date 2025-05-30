const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const challengeController = require('../controllers/challengeController');

router.post('/', auth, challengeController.createChallenge);
router.get('/', auth, challengeController.getCurrentChallenge);
router.get('/progress', auth, challengeController.getChallengeProgress);

module.exports = router;