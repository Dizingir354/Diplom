const Party = require('../db/models/Party');

// Создание новой партии
const createParty = async (req, res) => {
    try {
        const { title, description, genres, masters } = req.body;

        // Проверка на обязательные данные
        if (!title || !description || !genres || !masters) {
            return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля.' });
        }

        // Создаем новую партию
        const newParty = new Party({ title, description, genres, masters });
        await newParty.save();

        res.status(201).json({ message: 'Партия успешно создана.', party: newParty });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании партии.', error: error.message });
    }
};

// Получение всех партий
const getAllParties = async (req, res) => {
    try {
        const parties = await Party.find();
        res.status(200).json(parties);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении списка партий.', error: error.message });
    }
};

// Обновление информации о партии
const updateParty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, genres, masters, players } = req.body;

        // Обновляем партию
        const updatedParty = await Party.findByIdAndUpdate(
            id,
            { title, description, genres, masters, players },
            { new: true, runValidators: true }
        );

        if (!updatedParty) {
            return res.status(404).json({ message: 'Партия не найдена.' });
        }

        res.status(200).json({ message: 'Партия успешно обновлена.', party: updatedParty });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении партии.', error: error.message });
    }
};

// Удаление партии
const deleteParty = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedParty = await Party.findByIdAndDelete(id);
        if (!deletedParty) {
            return res.status(404).json({ message: 'Партия не найдена.' });
        }

        res.status(200).json({ message: 'Партия успешно удалена.' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении партии.', error: error.message });
    }
};

module.exports = {
    createParty,
    getAllParties,
    updateParty,
    deleteParty
};
