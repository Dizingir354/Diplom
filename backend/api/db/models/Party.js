const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    genres: {
        type: [String],
        required: true
    },
    masters: {
        type: [String], // массив имен мастеров
        required: true
    },
    players: {
        type: [String], // массив имен игроков
        default: [] // изначально пусто
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Party', partySchema);
