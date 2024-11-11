const Chat = require('../db/models/Chat');

// Получение всех сообщений чата
exports.getChatHistory = async (req, res) => {
  try {
    const messages = await Chat.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Сохранение нового сообщения
exports.saveMessage = async (username, message) => {
  const newMessage = new Chat({ username, message });
  await newMessage.save();
};
