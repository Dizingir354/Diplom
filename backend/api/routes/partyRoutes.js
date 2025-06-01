/**
 * @swagger
 * tags:
 *   name: Parties
 *   description: Управління іграми (партіями)
 */

/**
 * @swagger
 * /parties:
 *   post:
 *     summary: Створення нової партії
 *     tags: [Parties]
 *     responses:
 *       200:
 *         description: Партія створена успішно
 *
 *   get:
 *     summary: Отримати всі партії
 *     tags: [Parties]
 *     responses:
 *       200:
 *         description: Список партій
 */

/**
 * @swagger
 * /parties/{id}:
 *   get:
 *     summary: Отримати партію за ID
 *     tags: [Parties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID партії
 *     responses:
 *       200:
 *         description: Інформація про партію
 *
 *   put:
 *     summary: Оновити партію
 *     tags: [Parties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Партія оновлена
 *
 *   delete:
 *     summary: Видалити партію
 *     tags: [Parties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Партія видалена
 */

/**
 * @swagger
 * /parties/{id}/join:
 *   post:
 *     summary: Приєднатися до партії
 *     tags: [Parties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішне приєднання
 *
 * /parties/{id}/leave:
 *   delete:
 *     summary: Вийти з партії
 *     tags: [Parties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішний вихід
 */


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
router.get('/:id', validateObjectId, partyController.getPartyById);

module.exports = router;
