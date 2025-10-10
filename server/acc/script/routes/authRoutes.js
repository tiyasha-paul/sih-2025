const express = require('express');
const authController = require('../controllers/authcontroller');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Google OAuth routes
router.get('/auth/login', authController.googleLogin);
router.get('/auth/callback', authController.googleCallback);

module.exports = router;
