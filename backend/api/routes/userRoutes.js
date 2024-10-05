const express = require('express');
const { registerUser, verifyEmail } = require('../controllers/userController');
const router = express.Router();

// Регистрация пользователя
router.post('/register', registerUser);

// Подтверждение электронной почты
router.post('/verify', verifyEmail);

module.exports = router;
