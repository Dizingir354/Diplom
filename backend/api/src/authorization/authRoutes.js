const express = require('express');
const authController = require('./authController');

const router = express.Router();

// Отправка кода
router.post('/send-code', authController.sendVerificationCode);

// Регистрация
router.post('/register', authController.register);

// Логин
router.post('/login', authController.login);

module.exports = router;
