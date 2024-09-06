const mongoose = require('mongoose');

// Определение схемы профиля игрока или мастера
const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ссылка на пользователя
        required: true,
    },
    role: {
        type: String,
        enum: ['Player', 'Master'], // Роль пользователя: Игрок или Мастер
        required: true,
    },
    bio: {
        type: String,
        default: '',
    },
    games: {
        type: [String], // Список игр, в которые играет пользователь
        default: [],
    },
    experience: {
        type: Number, // Опыт в годах
        default: 0,
    },
});

// Создание модели профиля
const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
