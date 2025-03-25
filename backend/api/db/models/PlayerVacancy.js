const mongoose = require("mongoose");

const playerVacancySchema = new mongoose.Schema({
  description: { type: String, required: true },
  gameSystem: { type: String, required: true },
  platform: { type: String, required: true }, // Добавлено
  age: { type: String, required: true }, // Добавлено
  gameType: { type: String, required: true }, // Добавлено
  days: { type: [String], required: true }, // Добавлено (массив дней)
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uncomfortableTopics: {
    discomfort: { type: [String], default: [] },
    noDetails: { type: [String], default: [] },
    comfortable: { type: [String], default: [] }
  }
});

module.exports = mongoose.model("PlayerVacancy", playerVacancySchema);
