const mongoose = require('mongoose');

// Схема сообщения
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameSession: { type: mongoose.Schema.Types.ObjectId, ref: 'GameSession', required: true },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);