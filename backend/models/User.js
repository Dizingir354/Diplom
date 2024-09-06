const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Определение схемы пользователя
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // Поле для проверки email через код
    isVerified: {
        type: Boolean,
        default: false,
    },
});

// Шифрование пароля перед сохранением пользователя
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Создание модели пользователя на основе схемы
const User = mongoose.model('User', UserSchema);

module.exports = User;
