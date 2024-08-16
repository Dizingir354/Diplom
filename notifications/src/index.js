const express = require('express');
const app = express();
const port = process.env.PORT || 3003;

// Middleware для обработки JSON запросов
app.use(express.json());

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
  res.send('Notifications service is running');
});

// Маршрут для отправки уведомлений
app.post('/send-notification', (req, res) => {
  const { message, userId } = req.body;
  // Логика отправки уведомлений
  res.send(`Notification sent to user ${userId}: ${message}`);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Notifications service listening at http://localhost:${port}`);
});
