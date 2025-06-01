/**
 * @swagger
 * tags:
 *   name: PlayerVacancies
 *   description: Вакансії гравців
 */

/**
 * @swagger
 * /player-vacancies:
 *   post:
 *     summary: Створити вакансію гравця
 *     tags: [PlayerVacancies]
 *     responses:
 *       200:
 *         description: Вакансія створена
 *
 *   get:
 *     summary: Отримати всі вакансії
 *     tags: [PlayerVacancies]
 *     responses:
 *       200:
 *         description: Список вакансій
 */

/**
 * @swagger
 * /player-vacancies/{id}:
 *   get:
 *     summary: Отримати вакансію за ID
 *     tags: [PlayerVacancies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ID вакансії
 *     responses:
 *       200:
 *         description: Інформація про вакансію
 *
 *   put:
 *     summary: Оновити вакансію
 *     tags: [PlayerVacancies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Вакансія оновлена
 */

/**
 * @swagger
 * /player-vacancies/{id}/join:
 *   post:
 *     summary: Відгукнутись на вакансію
 *     tags: [PlayerVacancies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Успішно відгукнулись
 *
 * /player-vacancies/{id}/leave:
 *   delete:
 *     summary: Скасувати участь у вакансії
 *     tags: [PlayerVacancies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Участь скасовано
 */



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
