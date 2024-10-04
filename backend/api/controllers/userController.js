const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json'); // Путь к файлу

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    // Проверяем, что имя пользователя и пароль переданы
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Читаем текущих пользователей из файла
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        let users = [];
        try {
            users = JSON.parse(data); // Парсим содержимое файла
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Проверяем, существует ли уже пользователь
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' }); // Конфликт
        }

        // Добавляем нового пользователя
        const newUser = { username, password };
        users.push(newUser);

        // Сохраняем обновленный список пользователей обратно в файл
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Ошибка записи файла:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            console.log('Пользователь успешно сохранен в файл'); // Подтверждение успешного сохранения
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});
