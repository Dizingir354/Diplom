const nodemailer = require('nodemailer');

// Настройка транспорта
const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465, // или 587 для безопасного соединения
  secure: true, // true для 465, false для других портов
  auth: {
      user: 'gamefounder@ukr.net',
      pass: 'hc1dSqWKVnTWnUDu'
  }
});


// Функция отправки кода подтверждения
const sendVerificationEmail = (email, verificationCode) => {
    const mailOptions = {
        from: 'gamefounder@ukr.net',
        to: email,
        subject: 'Код подтверждения',
        text: `Ваш код подтверждения: ${verificationCode}`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
