const express = require('express');
const playerVacancyController = require('../controllers/playerVacancyController');

const router = express.Router();

router.post('/', playerVacancyController.createVacancy);
router.get('/', playerVacancyController.getAllVacancies);
router.get('/:id', playerVacancyController.getVacancyById);
router.put('/:id', playerVacancyController.updateVacancy);
router.post('/:id/invite', playerVacancyController.sendInvitation);

module.exports = router;