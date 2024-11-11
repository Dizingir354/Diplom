const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Маршрут для получения истории чата
router.get('/history', chatController.getChatHistory);

module.exports = router;
