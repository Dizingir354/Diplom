const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Подключаем маршруты

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware для работы с JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Маршрут для теста работы сервера
app.get('/', (req, res) => {
    res.send('Сервер работает корректно!');
});

// Основной маршрут для работы с пользователями (например, регистрация)
app.use('/api', userRoutes); // '/api/register' будет доступен по этому маршруту

// Обработка ошибок (рекомендуется добавлять)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Что-то пошло не так!' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
