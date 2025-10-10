// chatRoutes.js
const express = require('express');
const { getChatHistory, saveMessage, generateAIResponse } = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, getChatHistory);
router.post('/', auth, saveMessage);
router.post('/ai', auth, generateAIResponse);

module.exports = router;
