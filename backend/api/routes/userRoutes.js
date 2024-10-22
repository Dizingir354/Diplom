const express = require('express');
const multer = require('multer');
const { registerUser, verifyEmail, loginUser, uploadAvatar} = require('../controllers/userController');
const router = express.Router();

// Конфигурация multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Регистрация пользователя
router.post('/register', registerUser);

// Подтверждение электронной почты
router.post('/verify', verifyEmail);

// Логин пользователя
router.post('/login', loginUser);

// Маршрут для загрузки аватара
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;
