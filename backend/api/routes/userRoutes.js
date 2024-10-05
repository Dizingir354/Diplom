const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/verify-email', userController.verifyEmail);

module.exports = router;
