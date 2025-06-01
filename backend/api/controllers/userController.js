require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../db/models/User');
const { sendVerificationEmail } = require('../services/mailService');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

// 📌 Регистрация пользователя
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
        }

        // Хэшируем пароль перед сохранением
        const hashedPassword = await bcrypt.hash(password, 10);

        // Генерация кода подтверждения (на 30 дней)
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const verificationExpires = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 дней

        const newUser = new User({
            username,
            password: hashedPassword,
            email: email.toLowerCase(),
            verificationCode,
            verificationCodeSentAt: Date.now(),
            verificationExpires
        });

        await newUser.save();

        // Отправляем код на почту
        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: 'Пользователь зарегистрирован. Код подтверждения отправлен на почту.' });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
};

// 📌 Подтверждение email
const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Электронная почта уже подтверждена.' });
        }

        if (Date.now() > user.verificationExpires) {
            return res.status(400).json({ message: 'Код подтверждения истёк.' });
        }

        if (user.verificationCode !== parseInt(verificationCode, 10)) {
            return res.status(400).json({ message: 'Неправильный код подтверждения.' });
        }

        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        res.status(200).json({
            message: 'Email успешно подтвержден.',
            token,
            email: user.email,
            username: user.username,
            userId: user._id
        });
    } catch (error) {
        console.error('Ошибка при подтверждении email:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
};

// 📌 Логин пользователя с JWT
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден.' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Электронная почта не подтверждена.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Неправильный пароль.' });
        }

        // Генерируем JWT-токен
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        // Возвращаем токен и данные пользователя
        res.status(200).json({
            message: 'Вы успешно вошли в систему.',
            token,
            email: user.email,
            username: user.username,
            userId: user._id, // Возвращаем ID пользователя
        });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
};


module.exports = {
    registerUser,
    verifyEmail,
    loginUser
};
