const User = require('../../db/models/User');
const jwt = require('jsonwebtoken');

// Регистрация нового пользователя
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Проверка, существует ли пользователь
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        // Создание нового пользователя
        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при регистрации' });
    }
};

// Генерация токена JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};
