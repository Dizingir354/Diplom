const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./api/routes/userRoutes');

const app = express();
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB подключен'))
  .catch(err => console.log(err));

// Подключение маршрутов
app.use('/api/users', userRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
