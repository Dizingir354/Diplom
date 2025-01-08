const { sendVerificationEmail } = require('../services/mailService');
const fs = require('fs');
const path = require('path');
const User = require('../db/models/User'); // Импортируем модель User

const usersFilePath = path.join(__dirname, '../db/users.json');

// Функция для чтения и записи файла с пользователями
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data || '[]'); // Если файл пустой
    } catch (error) {
        console.error('Ошибка чтения файла пользователей:', error);
        return [];
    }
};

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

    console.log('Полученные данные для регистрации:', { username, password, email });

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Заполните все поля.' });
    }

    const users = readUsersFromFile();

    // Приводим email к нижнему регистру для сравнения
    const userExists = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (userExists) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
    }

    // Генерация кода подтверждения
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-значный код
    const verificationCodeSentAt = Date.now(); // Время отправки кода

    // Создание нового пользователя
    const newUser = new User(username, password, email, false, verificationCode);
    newUser.verificationCodeSentAt = verificationCodeSentAt; // Добавляем время отправки кода

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

    console.log('Полученные данные для верификации:', { email, verificationCode });

    if (!email || !verificationCode) {
        return res.status(400).json({ message: 'Заполните все поля.' });
    }

    const users = readUsersFromFile();  // Читаем пользователей из файла
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден.' });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: 'Электронная почта уже подтверждена.' });
    }

    // Приводим код подтверждения к числу для корректного сравнения
    if (user.verificationCode !== parseInt(verificationCode, 10)) {
        return res.status(400).json({ message: 'Неправильный код подтверждения.' });
    }

    // Проверка времени отправки кода подтверждения
    const tenMinutes = 10 * 60 * 1000; // 10 минут
    if (Date.now() - user.verificationCodeSentAt > tenMinutes) {
        return res.status(400).json({ message: 'Код подтверждения истек.' });
    }

    // Обновление статуса пользователя
    user.isVerified = true;
    user.verificationCode = null; // Удаляем код после подтверждения
    writeUsersToFile(users);  // Сохраняем обновленный массив пользователей

    res.status(200).json({ message: 'Email успешно подтвержден.' });
};

// Логин пользователя
const loginUser = (req, res) => {
    const { email, password } = req.body;

    console.log('Полученные данные для логина:', { email, password });

    if (!email || !password) {
        return res.status(400).json({ message: 'Заполните все поля.' });
    }

    const users = readUsersFromFile();
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден.' });
    }

    if (!user.isVerified) {
        return res.status(400).json({ message: 'Электронная почта не подтверждена.' });
    }

    if (user.password !== password) {
        return res.status(400).json({ message: 'Неправильный пароль.' });
    }

    res.status(200).json({ message: 'Вы успешно вошли в систему.' });
};

const uploadAvatar = (req, res) => {
    const { email } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Файл не загружен.' });
    }

    const users = readUsersFromFile();
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Генерация уникального имени файла для аватара
    const avatarFileName = `avatar-${user.username}-${Date.now()}.png`;
    const avatarFilePath = path.join('uploads', avatarFileName);
};

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    uploadAvatar
};
