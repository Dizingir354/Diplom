const express = require('express');
const playerVacancyController = require('../controllers/playerVacancyController');
const router = express.Router();

router.post('/', playerVacancyController.createVacancy);
router.get('/', playerVacancyController.getAllVacancies);
router.get('/:id', playerVacancyController.getVacancyById);
router.put('/:id', playerVacancyController.updateVacancy);
router.post('/:id/invite', playerVacancyController.sendInvitation);

// Временное хранилище для вакансий (позже можно заменить на базу данных)
//const playerVacancies = [];

// Маршрут для создания вакансии игрока
/*router.post('/', (req, res) => {
    const { playerName, description, preferredGenres } = req.body;
    const newVacancy = {
        id: playerVacancies.length + 1,
        playerName,
        description,
        preferredGenres
    };

    playerVacancies.push(newVacancy);
    res.status(201).json(newVacancy);
});*/



module.exports = router;
