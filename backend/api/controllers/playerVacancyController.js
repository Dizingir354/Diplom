const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../db/storage/playerVacancies.json');

// Чтение данных из файла
const readData = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

// Запись данных в файл
const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Создать вакансию игрока
exports.createVacancy = (req, res) => {
    try {
        const { playerName, description, preferredGenres } = req.body;

        const vacancies = readData();
        const newVacancy = {
            id: vacancies.length + 1,
            playerName,
            description,
            preferredGenres,
            createdAt: new Date().toISOString(),
        };

        vacancies.push(newVacancy);
        writeData(vacancies);

        res.status(201).json(newVacancy);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании вакансии' });
    }
};

// Получить список всех вакансий игроков
exports.getAllVacancies = (req, res) => {
    try {
        const vacancies = readData();
        res.status(200).json(vacancies);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении списка вакансий' });
    }
};

// Получить вакансию по ID
exports.getVacancyById = (req, res) => {
    try {
        const vacancies = readData();
        const vacancy = vacancies.find(v => v.id === parseInt(req.params.id));

        if (!vacancy) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }

        res.status(200).json(vacancy);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении вакансии' });
    }
};

// Обновить вакансию
exports.updateVacancy = (req, res) => {
    try {
        const { playerName, description, preferredGenres } = req.body;
        const vacancies = readData();

        const index = vacancies.findIndex(v => v.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }

        const updatedVacancy = {
            ...vacancies[index],
            playerName: playerName || vacancies[index].playerName,
            description: description || vacancies[index].description,
            preferredGenres: preferredGenres || vacancies[index].preferredGenres,
        };

        vacancies[index] = updatedVacancy;
        writeData(vacancies);

        res.status(200).json(updatedVacancy);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении вакансии' });
    }
};

// Отправить приглашение игроку
exports.sendInvitation = (req, res) => {
    try {
        const vacancies = readData();
        const vacancy = vacancies.find(v => v.id === parseInt(req.params.id));

        if (!vacancy) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }

        // Здесь можно реализовать логику приглашения
        res.status(200).json({ message: 'Приглашение отправлено' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при отправке приглашения' });
    }
};
