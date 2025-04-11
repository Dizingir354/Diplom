const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: "" },
  days: [{ type: String }],
  gameType: { type: String },
  age: { type: String },
  platforms: [{ type: String }],
  system: { type: String },
  otherTags: [{ type: String }],
  requirements: { type: String },
  masters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model("Party", PartySchema);
