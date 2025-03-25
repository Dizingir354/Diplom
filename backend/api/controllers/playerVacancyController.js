const PlayerVacancy = require('../db/models/PlayerVacancy');
const mongoose = require("mongoose");

// Проверка, что `id` - это `ObjectId`
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Некорректный ID.' });
    }
    next();
};

// Создать вакансию игрока
const createVacancy = async (req, res) => {
    try {
        console.log("Полученные данные:", req.body);

        const { description, gameSystem, platform, age, gameType, days, uncomfortableTopics, userId } = req.body;

        if (!description || !gameSystem || !platform || !age || !gameType || !days?.length || !userId) {
            return res.status(400).json({ message: "Заполните все обязательные поля." });
        }

        const newVacancy = new PlayerVacancy({
            description,
            gameSystem,
            platform,
            age,
            gameType,
            days,
            creator: userId, // теперь берём userId и сохраняем как creator
            uncomfortableTopics
        });

        await newVacancy.save();
        res.status(201).json(newVacancy);
    } catch (error) {
        console.error("Ошибка создания вакансии:", error);
        res.status(500).json({ message: "Ошибка сервера", error });
    }
};

// Получить список всех вакансий игроков
const getAllVacancies = async (req, res) => {
    try {
        const vacancies = await PlayerVacancy.find();
        res.status(200).json(vacancies);
    } catch (error) {
        console.error("Ошибка при получении списка вакансий:", error);
        res.status(500).json({ error: 'Ошибка при получении списка вакансий', details: error.message });
    }
};

// Получить вакансию по ID
const getVacancyById = async (req, res) => {
    try {
        const vacancy = await PlayerVacancy.findById(req.params.id);
        if (!vacancy) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }
        res.status(200).json(vacancy);
    } catch (error) {
        console.error("Ошибка при получении вакансии:", error);
        res.status(500).json({ error: 'Ошибка при получении вакансии', details: error.message });
    }
};

// Обновить вакансию
const updateVacancy = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, gameSystem, platform, age, gameType, days, uncomfortableTopics } = req.body;

        if (!description || !gameSystem || !platform || !age || !gameType || !days?.length) {
            return res.status(400).json({ message: "Заполните все обязательные поля." });
        }

        const updatedVacancy = await PlayerVacancy.findByIdAndUpdate(
            id,
            { description, gameSystem, platform, age, gameType, days, uncomfortableTopics },
            { new: true, runValidators: true }
        );

        if (!updatedVacancy) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }

        res.status(200).json(updatedVacancy);
    } catch (error) {
        console.error("Ошибка при обновлении вакансии:", error);
        res.status(500).json({ error: 'Ошибка при обновлении вакансии', details: error.message });
    }
};

// Присоединение к вакансии
const joinVacancy = async (req, res) => {
    try {
        const { id } = req.params;
        const { playerId } = req.body;

        const vacancy = await PlayerVacancy.findById(id);
        if (!vacancy) return res.status(404).json({ message: 'Вакансия не найдена.' });

        if (vacancy.creator.toString() === playerId) {
            return res.status(400).json({ message: 'Вы уже являетесь создателем этой вакансии.' });
        }

        return res.status(200).json({ message: 'Вы присоединились к вакансии.' });
    } catch (error) {
        console.error("Ошибка при присоединении:", error);
        res.status(500).json({ message: 'Ошибка при присоединении.', error: error.message });
    }
};

// Покинуть вакансию
const leaveVacancy = async (req, res) => {
    try {
        const { id } = req.params;
        const { playerId } = req.body;

        const vacancy = await PlayerVacancy.findById(id);
        if (!vacancy) return res.status(404).json({ message: 'Вакансия не найдена.' });

        return res.status(200).json({ message: 'Вы покинули вакансию.' });
    } catch (error) {
        console.error("Ошибка при выходе:", error);
        res.status(500).json({ message: 'Ошибка при выходе.', error: error.message });
    }
};

module.exports = {
    createVacancy,
    getAllVacancies,
    getVacancyById,
    updateVacancy,
    joinVacancy,
    leaveVacancy,
    validateObjectId
};
