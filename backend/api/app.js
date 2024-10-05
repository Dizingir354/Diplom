const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Предполагаем, что роуты в отдельном файле

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

// Подключаем маршруты для API
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
