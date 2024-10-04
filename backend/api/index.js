const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Разрешаем CORS для всех доменов
app.use(bodyParser.json()); // Разбираем JSON из тела запроса

app.post('/api/register', (req, res) => {
    const { username, password } = req.body; // Извлекаем данные

    console.log('Received data:', req.body); // Логируем полученные данные

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' }); // Проверяем данные
    }


    res.status(201).json({ message: 'User registered successfully' }); // Отправляем ответ
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
