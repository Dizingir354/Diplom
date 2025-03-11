const Party = require('../db/models/Party');

// Создание новой партии
const createParty = async (req, res) => {
    try {
        console.log("Полученные данные:", req.body);

        const { title, description, days, gameType, age, platforms, system, otherTags, requirements, masters } = req.body;

        if (!title || !description || !days?.length || !gameType || !age || !platforms?.length || !system || !masters?.length) {
            console.log("Ошибка: не все обязательные поля заполнены.");
            return res.status(400).json({ message: 'Заполните все обязательные поля.' });
        }

        const existingParty = await Party.findOne({ title });
        if (existingParty) {
            console.log("Ошибка: партия с таким названием уже существует.");
            return res.status(400).json({ message: 'Партия с таким названием уже существует.' });
        }

        const newParty = new Party({
            title,
            description,
            days,
            gameType,
            age,
            platforms,
            system,
            otherTags,
            requirements,
            masters, // Теперь берём `masters` из `req.body`
            players: []
        });

        await newParty.save();
        console.log("Партия успешно создана:", newParty);

        return res.status(201).json({ message: 'Партия успешно создана.', party: newParty });
    } catch (error) {
        console.error("Ошибка при создании партии:", error.message);
        return res.status(500).json({ message: 'Ошибка при создании партии.', error: error.message });
    }
};


// Получение всех партий
const getAllParties = async (req, res) => {
    try {
        const parties = await Party.find();
        return res.status(200).json(parties);
    } catch (error) {
        return res.status(500).json({ message: 'Ошибка при получении списка партий.', error: error.message });
    }
};

// Обновление информации о партии
const updateParty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, genres, masters, players } = req.body;

        if (!title || !description || !genres?.length || !masters?.length) {
            return res.status(400).json({ message: 'Заполните все обязательные поля.' });
        }

        const updatedParty = await Party.findByIdAndUpdate(
            id,
            { title, description, genres, masters, players },
            { new: true, runValidators: true }
        );

        if (!updatedParty) {
            return res.status(404).json({ message: 'Партия не найдена.' });
        }

        return res.status(200).json({ message: 'Партия успешно обновлена.', party: updatedParty });
    } catch (error) {
        return res.status(500).json({ message: 'Ошибка при обновлении партии.', error: error.message });
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

        return res.status(200).json({ message: 'Партия успешно удалена.' });
    } catch (error) {
        return res.status(500).json({ message: 'Ошибка при удалении партии.', error: error.message });
    }
};

// Присоединение к партии
const joinParty = async (req, res) => {
    try {
        const { id } = req.params;
        const { playerId } = req.body;

        const party = await Party.findById(id);
        if (!party) return res.status(404).json({ message: 'Партия не найдена.' });

        if (party.players.includes(playerId)) {
            return res.status(400).json({ message: 'Вы уже в этой партии.' });
        }

        party.players.push(playerId);
        await party.save();

        return res.status(200).json({ message: 'Вы присоединились к партии.', players: party.players });
    } catch (error) {
        return res.status(500).json({ message: 'Ошибка при присоединении.', error: error.message });
    }
};

// Покинуть партию
const leaveParty = async (req, res) => {
    try {
        const { id } = req.params;
        const { playerId } = req.body;

        const party = await Party.findById(id);
        if (!party) return res.status(404).json({ message: 'Партия не найдена.' });

        party.players = party.players.filter(player => player !== playerId);
        await party.save();

        return res.status(200).json({ message: 'Вы покинули партию.', players: party.players });
    } catch (error) {
        return res.status(500).json({ message: 'Ошибка при выходе.', error: error.message });
    }
};

module.exports = {
    createParty,
    getAllParties,
    updateParty,
    deleteParty,
    joinParty,
    leaveParty
};
