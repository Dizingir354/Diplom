// src/services/mailService.js
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendMail,
};

router.post('/send-hello', mailController.sendHelloWorldEmail);

module.exports = router;