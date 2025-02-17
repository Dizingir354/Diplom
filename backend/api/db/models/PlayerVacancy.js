const mongoose = require('mongoose');

const playerVacancySchema = new mongoose.Schema({
  playerName: { type: String, required: true, minlength: 2, maxlength: 50 },
  description: { type: String, required: true, minlength: 10, maxlength: 500 },
  gameSystem: { type: String, required: true },
  preferredGenres: [{ type: String }], // Список предпочтительных жанров
  tags: {
    type: Map,
    of: String, // Значения могут быть 'Дискомфортно', 'Без подробиць', 'Комфортно'
    default: {},
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PlayerVacancy', playerVacancySchema);
