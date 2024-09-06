const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const User = require('./UserModel');

// Временное хранилище для кодов подтверждения
const verificationCodes = {};

const transporter = nodemailer.createTransport({
    service: 'ukr.net',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Отправка кода на почту
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is ${code}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        verificationCodes[email] = code;
        res.json({ success: true, message: 'Verification code sent.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending email.' });
    }
};

// Регистрация
exports.register = async (req, res) => {
    const { name, email, password, code } = req.body;

    if (verificationCodes[email] !== code) {
        return res.status(401).json({ success: false, message: 'Invalid verification code.' });
    }

    // Проверка, существует ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const newUser = new User({
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
    });

    await newUser.save();

    delete verificationCodes[email];
    res.json({ success: true, message: 'User registered successfully.' });
};

// Логин
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ success: false, message: 'Invalid password.' });
    }

    res.json({ success: true, message: 'Login successful.' });
};
