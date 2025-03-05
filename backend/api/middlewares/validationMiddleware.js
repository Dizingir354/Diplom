const { body, validationResult } = require('express-validator');

// Функция для обработки ошибок валидации
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Валидация регистрации
const validateRegistration = [
    body('username').notEmpty().withMessage('Имя пользователя обязательно'),
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть минимум 6 символов'),
    handleValidationErrors
];

// Валидация логина
const validateLogin = [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').notEmpty().withMessage('Пароль обязателен'),
    handleValidationErrors
];

// Валидация подтверждения email
const validateEmailVerification = [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('verificationCode').isNumeric().withMessage('Код подтверждения должен быть числом'),
    handleValidationErrors
];

module.exports = { validateRegistration, validateLogin, validateEmailVerification };
