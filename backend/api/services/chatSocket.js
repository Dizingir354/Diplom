const { Server } = require('socket.io');
const Message = require('../db/models/Message');

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🟢 Нове підключення');

    socket.on('joinRoom', async ({ partyId, username }) => {
      socket.join(partyId);
      console.log(`🔗 ${username} приєднався до кімнати ${partyId}`);

      // Отправить историю сообщений при подключении
      try {
        const messages = await Message.find({ partyId }).sort({ time: 1 }).lean();
        socket.emit('chatHistory', messages);
      } catch (err) {
        console.error('❌ Не удалось получить историю чата:', err);
      }
    });

    socket.on('chatMessage', async ({ partyId, username, message }) => {
      const msg = {
        username,
        message,
        time: new Date().toISOString(),
      };

      try {
        // Сохраняем сообщение в БД
        const newMessage = new Message({ partyId, username, message });
        await newMessage.save();
      } catch (err) {
        console.error('❌ Ошибка при сохранении сообщения:', err);
      }

      io.to(partyId).emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Користувач відключився');
    });
  });
};
