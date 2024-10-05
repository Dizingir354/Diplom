const { sendVerificationEmail } = require('../services/mailService');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../db/users.json');

// Функция для чтения файла с пользователями
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка чтения файла пользователей:', error);
        return [];
    }
};

// Функция для записи данных в файл пользователей
const writeUsersToFile = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
        console.error('Ошибка записи файла пользователей:', error);
    }
};

// Регистрация пользователя
const registerUser = (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Заполните все поля.' });
    }

    const users = readUsersFromFile();
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
    }

    // Генерация кода подтверждения
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-значный код

    const newUser = {
        username,
        password,
        email,
        verificationCode,
        isVerified: false,
        verificationCodeSentAt: Date.now() // Время отправки кода
    };

    users.push(newUser);
    writeUsersToFile(users);

    // Отправка письма с кодом подтверждения
    sendVerificationEmail(email, verificationCode)
        .then(() => {
            res.status(200).json({ message: 'Пользователь зарегистрирован. Код подтверждения отправлен на почту.' });
        })
        .catch(error => {
            console.error('Ошибка при отправке письма:', error);
            res.status(500).json({ message: 'Ошибка при отправке кода подтверждения.' });
        });
};

// Подтверждение электронной почты
const verifyEmail = (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        return res.status(400).json({ message: 'Заполните все поля.' });
    }

    const users = readUsersFromFile();
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден.' });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: 'Электронная почта уже подтверждена.' });
    }

    if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ message: 'Неправильный код подтверждения.' });
    }

    // Проверка времени отправки кода подтверждения
    const tenMinutes = 10 * 60 * 1000; // 10 минут
    if (Date.now() - user.verificationCodeSentAt > tenMinutes) {
        return res.status(400).json({ message: 'Код подтверждения истек.' });
    }

    user.isVerified = true;
    writeUsersToFile(users);

    res.status(200).json({ message: 'Email успешно подтвержден.' });
};

module.exports = {
    registerUser,
    verifyEmail
};
