const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 5000;

// Настройка CORS
app.use(cors());

// Для работы с JSON
app.use(bodyParser.json());

// Путь к файлу с пользователями
const usersFilePath = path.join(__dirname, 'db', 'users.json');

// Чтение пользователей из файла
function getUsers() {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
}

// Добавление нового пользователя
function addUser(user) {
    const users = getUsers();
    users.push(user);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Проверка на существование пользователя
function userExists(username) {
    const users = getUsers();
    return users.some(user => user.username === username);
}

// Маршрут регистрации
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (userExists(username)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        username,
        password: hashedPassword,
        email
    };

    addUser(newUser);
    res.status(201).json({ success: true, message: 'User registered successfully' });
});

// Маршрут логина
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, message: 'Login successful' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
