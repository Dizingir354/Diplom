const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

// Маршрут для регистрации пользователя
router.post('/register', registerUser);

module.exports = router;
