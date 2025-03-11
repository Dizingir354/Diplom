const express = require('express');
const router = express.Router();
const partyController = require('../controllers/partyController');
const mongoose = require('mongoose');

// Проверка, что `id` - это `ObjectId`
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Некорректный ID.' });
    }
    next();
};

// Роуты
router.post('/', partyController.createParty);
router.get('/', partyController.getAllParties);
router.put('/:id', validateObjectId, partyController.updateParty);
router.delete('/:id', validateObjectId, partyController.deleteParty);
router.post('/:id/join', validateObjectId, partyController.joinParty);
router.delete('/:id/leave', validateObjectId, partyController.leaveParty);

module.exports = router;
