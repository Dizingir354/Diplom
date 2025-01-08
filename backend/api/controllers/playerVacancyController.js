const PlayerVacancy = require('../db/models/PlayerVacancy'); // Подключаем модель

// Создать вакансию игрока
exports.createVacancy = async (req, res) => {
    try {
        const { playerName, description, preferredGenres } = req.body;

        const newVacancy = new PlayerVacancy({
            playerName,
            description,
            preferredGenres,
        });

        await newVacancy.save();

        res.status(201).json(newVacancy);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании вакансии', details: error.message });
    }
};

// Получить список всех вакансий игроков
exports.getAllVacancies = async (req, res) => {
    try {
        const vacancies = await PlayerVacancy.find(); // Получаем все вакансии из базы данных
        res.status(200).json(vacancies);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении списка вакансий', details: error.message });
    }
};

// Получить вакансию по ID
exports.getVacancyById = async (req, res) => {
    try {
        const vacancy = await PlayerVacancy.findById(req.params.id); // Ищем вакансию по ID

        if (!vacancy) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }

        res.status(200).json(vacancy);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении вакансии', details: error.message });
    }
};

// Обновить вакансию
exports.updateVacancy = async (req, res) => {
    try {
        const { playerName, description, preferredGenres } = req.body;

        const updatedVacancy = await PlayerVacancy.findByIdAndUpdate(
            req.params.id, // Ищем вакансию по ID
            { playerName, description, preferredGenres }, // Обновляем только указанные поля
            { new: true, runValidators: true } // Опция: вернуть обновленный объект и проверять поля
        );

        if (!updatedVacancy) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }

        res.status(200).json(updatedVacancy);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении вакансии', details: error.message });
    }
};

// Отправить приглашение игроку
exports.sendInvitation = async (req, res) => {
    try {
        const vacancy = await PlayerVacancy.findById(req.params.id); // Ищем вакансию по ID

        if (!vacancy) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }

        // Здесь можно реализовать логику приглашения
        res.status(200).json({ message: 'Приглашение отправлено' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при отправке приглашения', details: error.message });
    }
};
