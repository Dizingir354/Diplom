// src/routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const mailRoutes = require('./mailRoutes');

router.use('/users', userRoutes);
router.use('/mail', mailRoutes);

module.exports = router;
