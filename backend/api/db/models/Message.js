const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  partyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
