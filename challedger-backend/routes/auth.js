const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);  // Route for user signup (registration)
router.post('/login', authController.login);   // Route for user login (authentication)

module.exports = router;  // Export the router to be used in the main app