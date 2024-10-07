const express = require('express');
const { registerUser, verifyEmail, loginUser } = require('../controllers/userController');
const router = express.Router();

// Регистрация пользователя
router.post('/register', registerUser);

// Подтверждение электронной почты
router.post('/verify', verifyEmail);

// Логин пользователя
router.post('/login', loginUser);

module.exports = router;
