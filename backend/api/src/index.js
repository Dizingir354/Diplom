const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const verificationCodes = {}; // Временное хранилище кодов подтверждения

// Настройка почтового сервера
const transporter = nodemailer.createTransport({
    service: 'ukr.net',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Маршрут для отправки кода на почту
app.post('/api/send-code', async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Генерация случайного 6-значного кода
    verificationCodes[email] = code; // Сохранение кода для проверки при регистрации

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your verification code',
        text: `Your code is ${code}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Код отправлен на вашу почту.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.json({ success: false, message: 'Ошибка отправки кода.' });
    }
});

// Маршрут для регистрации
app.post('/api/register', (req, res) => {
    const { name, email, password, code } = req.body;

    // Проверка кода подтверждения
    if (verificationCodes[email] !== code) {
        return res.status(400).json({ success: false, message: 'Неверный код подтверждения.' });
    }

    //Логика регистрации

    delete verificationCodes[email]; // Удаление кода подтверждения после успешной регистрации
    res.json({ success: true, message: 'Регистрация успешна!' });
});

// Маршрут для логина
app.post('/api/login', (req, res) => {
    const { email, password, code } = req.body;
    // Здесь логика для проверки кода и логина пользователя
    res.json({ success: true }); // или false в случае ошибки
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
