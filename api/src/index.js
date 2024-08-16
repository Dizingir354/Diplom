const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
// const mailService = require('./services/mailService');

const app = express();
app.use(bodyParser.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Закомментировано
  // try {
  //   const email = 'gamefounder@ukr.net';
  //   const subject = 'Test Email';
  //   const text = 'Hello world';
    
  //   await mailService.sendMail(email, subject, text);
  //   console.log('Test email sent successfully.');
  // } catch (error) {
  //   console.error(`Failed to send test email: ${error.message}`);
  // }
});
