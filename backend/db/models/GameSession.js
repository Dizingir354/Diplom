// backend/models/GameSession.js
const mongoose = require('mongoose');

// Схема партии
const gameSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  master: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startTime: { type: Date, required: true },
  notificationsEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('GameSession', gameSessionSchema);
