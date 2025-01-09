const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: Number },
    verificationCodeSentAt: { type: Date }, // Для проверки времени жизни кода
    avatar: { type: String } // Поле для хранения пути к аватару
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
