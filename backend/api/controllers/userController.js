const User = require('../db/models/User');
const { sendVerificationEmail } = require('../services/mailService');

// Регистрация пользователя
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Заполните все поля.' });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
        }

        // Генерация кода подтверждения
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Создание нового пользователя
        const newUser = new User({
            username,
            password,
            email: email.toLowerCase(),
            verificationCode,
            verificationCodeSentAt: Date.now(),
        });

        await newUser.save();

        // Отправка письма с кодом подтверждения
        await sendVerificationEmail(email, verificationCode);
        res.status(200).json({ message: 'Пользователь зарегистрирован. Код подтверждения отправлен на почту.' });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
};

// Подтверждение email
const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        return res.status(400).json({ message: 'Заполните все поля.' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Электронная почта уже подтверждена.' });
        }

        const tenMinutes = 10 * 60 * 1000; // 10 минут
        if (Date.now() - user.verificationCodeSentAt > tenMinutes) {
            return res.status(400).json({ message: 'Код подтверждения истек.' });
        }

        if (user.verificationCode !== parseInt(verificationCode, 10)) {
            return res.status(400).json({ message: 'Неправильный код подтверждения.' });
        }

        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ message: 'Email успешно подтвержден.' });
    } catch (error) {
        console.error('Ошибка при подтверждении email:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
};

// Логин пользователя
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Заполните все поля.' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден.' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Электронная почта не подтверждена.' });
        }

        if (user.password !== password) { // Здесь стоит заменить на хэширование пароля
            return res.status(400).json({ message: 'Неправильный пароль.' });
        }

        res.status(200).json({ message: 'Вы успешно вошли в систему.' });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
};

// Загрузка аватара
const uploadAvatar = async (req, res) => {
    const { email } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Файл не загружен.' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        // Генерация уникального имени файла
        const avatarFileName = `avatar-${user.username}-${Date.now()}.png`;
        const avatarFilePath = path.join('uploads', avatarFileName);

        // Сохранение файла
        fs.writeFileSync(avatarFilePath, req.file.buffer);
        user.avatar = avatarFilePath;
        await user.save();

        res.status(200).json({ message: 'Аватар успешно загружен.', avatarPath: avatarFilePath });
    } catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    uploadAvatar
};
