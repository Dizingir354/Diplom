const express = require('express');
const { registerUser, verifyEmail, loginUser } = require('../controllers/userController');
const { validateRegistration, validateLogin, validateEmailVerification } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/verify', validateEmailVerification, verifyEmail);

module.exports = router;
