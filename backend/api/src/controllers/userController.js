const User = require('../models/User'); // Импорт модели пользователя
const mailService = require('../services/mailService'); // Импорт почтового сервиса
const crypto = require('crypto'); // Для создания токена активации

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка наличия пользователя с таким же email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Создание нового пользователя
    const activationToken = crypto.randomBytes(32).toString('hex');
    const newUser = new User({
      email,
      password,
      isActive: false,
      activationToken
    });

    // Сохранение пользователя в базе данных
    await newUser.save();

    // Отправка письма для валидации почты
    const validationUrl = `${req.protocol}://${req.get('host')}/api/users/activate/${activationToken}`;
    const emailSubject = 'Email Validation';
    const emailText = `Please validate your email by clicking the following link: ${validationUrl}`;

    await mailService.sendMail(email, emailSubject, emailText);

    res.status(201).json({ message: 'User registered. Please check your email to activate your account.' });
  } catch (error) {
    res.status(500).json({ message: `Failed to register user: ${error.message}` });
  }
};

exports.activate = async (req, res) => {
  try {
    const { token } = req.params;

    // Поиск пользователя с соответствующим токеном активации
    const user = await User.findOne({ activationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid activation token' });
    }

    // Активация пользователя
    user.isActive = true;
    user.activationToken = undefined; // Удаление токена активации

    await user.save();

    res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    res.status(500).json({ message: `Failed to activate user: ${error.message}` });
  }
};

// Функция для отправки тестового сообщения
exports.sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const subject = 'Test Email';
    const text = 'Hello world';
    
    await mailService.sendMail(email, subject, text);
    
    res.status(200).json({ message: 'Test email sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: `Failed to send test email: ${error.message}` });
  }
};
