const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB подключен'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
const authRoutes = require('./routes/authRoutes');
// Добавьте другие маршруты по мере необходимости

app.use('/api/auth', authRoutes);

// Обработка WebSocket соединений
io.on('connection', (socket) => {
  console.log('Новое соединение:', socket.id);

  // Обработка событий
  socket.on('message', (data) => {
    // Логика обработки сообщений
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});