const nodemailer = require('nodemailer');

// Настройка транспорта для Nodemailer с использованием учетных данных из .env файла
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, // true для портов 465, false для других портов
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Функция для отправки электронной почты
const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

module.exports = { sendMail };
