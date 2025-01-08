const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');  // Подключаем модуль http для работы с WebSocket
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const chatSocket = require('./services/chatSocket');  // Подключаем WebSocket-сервис
const playerVacancyRoutes = require('./routes/playerVacancyRoutes');
const mongoose = require('./services/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Настраиваем основные middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// Подключаем роуты для пользователя и чата
app.use('/api', userRoutes);
app.use('/api/chat', chatRoutes);

// Раздача статических файлов для аватаров
app.use('/uploads', express.static(path.join(__dirname, 'db/storage/uploads')));

app.use('/api/player-vacancies', playerVacancyRoutes);

// Тестовый маршрут
app.get('/', (req, res) => {
    res.send('Сервер работает корректно!');
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Что-то пошло не так!' });
});

// Создаём HTTP сервер и интегрируем его с Express
const server = http.createServer(app);

// Инициализация WebSocket сервиса
chatSocket(server);  // Передаём HTTP сервер в WebSocket сервис

// Запуск сервера
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
