const mongoose = require('mongoose');

const playerVacancySchema = new mongoose.Schema({
  playerName: { type: String, required: true, minlength: 2, maxlength: 50 }, // Имя игрока
  description: { type: String, required: true, minlength: 10, maxlength: 500 }, // Описание
  gameSystem: { type: String, required: true }, // Система игры
  createdAt: { type: Date, default: Date.now }, // Дата создания
});

module.exports = mongoose.model('PlayerVacancy', playerVacancySchema);
