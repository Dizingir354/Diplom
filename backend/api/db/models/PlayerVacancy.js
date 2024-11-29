const mongoose = require('mongoose');

const playerVacancySchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    description: { type: String, required: true },
    preferredGenres: { type: [String], required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('PlayerVacancy', playerVacancySchema);
