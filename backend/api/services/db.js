const mongoose = require('mongoose');

require('dotenv').config(); // Подключение переменных окружения из .env

const mongoURI = process.env.MONGO_URI;

// Подключение к MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB подключен успешно'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));

module.exports = mongoose;