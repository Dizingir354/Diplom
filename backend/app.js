const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('../backend/api/routes/userRoutes'); // Подключаем маршруты

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для CORS (разрешаем запросы с других портов, например, с клиента)
app.use(cors({ origin: 'http://127.0.0.1:5500' }));  // Укажите точный источник фронтенда, если нужно
// Или временно разрешаем все запросы
// app.use(cors());

// Middleware для работы с JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Маршрут для теста работы сервера
app.get('/', (req, res) => {
    res.send('Сервер работает корректно!');
});

// Основной маршрут для работы с пользователями (например, регистрация)
app.use('/api', userRoutes); // '/api/register' будет доступен по этому маршруту

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
