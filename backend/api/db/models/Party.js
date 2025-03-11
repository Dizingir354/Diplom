const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: "" }, // Для загрузки изображения
  days: [{ type: String }], // Дни недели
  gameType: { type: String }, // Кампания, ваншот, короткий модуль
  age: { type: String }, // 14+, 16+, 18+, 25+
  platforms: [{ type: String }], // Roll20, Foundry и т.д.
  system: { type: String }, // DnD 5e, Pathfinder и т.д.
  otherTags: [{ type: String }], // Другие теги
  requirements: { type: String }, // Требования к игрокам
  masters: [{ type: String, required: true }], // Ведущие игры
  players: [{ type: String }] // Список игроков, которые присоединились
});

module.exports = mongoose.model("Party", PartySchema);
