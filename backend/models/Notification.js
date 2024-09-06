const mongoose = require('mongoose');

// Определение схемы уведомлений
const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ссылка на модель пользователя
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Создание модели уведомлений
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
