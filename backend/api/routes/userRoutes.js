const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/avatarUpload');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware для проверки токена

// Загрузка аватарки
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;