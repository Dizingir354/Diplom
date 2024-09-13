const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bio: { type: String },
  experience: { type: Number }, // Опыт в годах
  games: [{ type: String }], // Список игр
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);