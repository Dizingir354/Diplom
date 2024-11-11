const WebSocket = require('ws');
const chatController = require('../controllers/chatController');

const chatSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', async (data) => {
      const { username, message } = JSON.parse(data);

      // Сохранение сообщения в базе данных
      await chatController.saveMessage(username, message);

      // Рассылка сообщения всем подключенным клиентам
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ username, message }));
        }
      });
    });
  });
};

module.exports = chatSocket;
