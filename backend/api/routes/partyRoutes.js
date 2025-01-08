const express = require('express');
const router = express.Router();
const partyController = require('../controllers/partyController');

// Роут для создания новой партии
router.post('/', partyController.createParty);

// Роут для получения всех партий
router.get('/', partyController.getAllParties);

// Роут для обновления партии
router.put('/:id', partyController.updateParty);

// Роут для удаления партии
router.delete('/:id', partyController.deleteParty);

module.exports = router;
