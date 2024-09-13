const mongoose = require('mongoose');

// Определение схемы для голосового чата
const VoiceChatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Список пользователей в голосовом чате
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

// Создание модели голосового чата
const VoiceChat = mongoose.model('VoiceChat', VoiceChatSchema);

module.exports = VoiceChat;
