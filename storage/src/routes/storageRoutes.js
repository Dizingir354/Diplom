const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storageController');

router.post('/upload', storageController.uploadFile);
router.get('/file/:name', storageController.getFile);

module.exports = router;
