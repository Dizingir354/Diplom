const express = require('express');
const playerVacancyController = require('../controllers/playerVacancyController'); // Убедись, что тут правильный путь
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');

const router = express.Router();

// Проверка, что `id` - это `ObjectId`
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Некорректный ID.' });
    }
    next();
};

router.post('/', playerVacancyController.createVacancy); // Должно работать
router.get('/', playerVacancyController.getAllVacancies);
router.get('/:id', validateObjectId, playerVacancyController.getVacancyById);
router.put('/:id', validateObjectId, playerVacancyController.updateVacancy);
router.post('/:id/join', validateObjectId, playerVacancyController.joinVacancy);
router.delete('/:id/leave', validateObjectId, playerVacancyController.leaveVacancy);

module.exports = router;
