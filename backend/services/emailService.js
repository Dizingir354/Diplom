const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Или ваш почтовый сервис
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Подтверждение электронной почты',
    text: 'Спасибо за регистрацию. Пожалуйста, подтвердите вашу почту.',
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
  }
};
