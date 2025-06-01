/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации
 */


const express = require('express');
const { registerUser, verifyEmail, loginUser } = require('../controllers/userController');
const { validateRegistration, validateLogin, validateEmailVerification } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/verify', validateEmailVerification, verifyEmail);

module.exports = router;
