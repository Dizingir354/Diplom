const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const usersFilePath = path.join(__dirname, '../../db/users.json');

// Helper function to read users from the JSON file
const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const usersData = fs.readFileSync(usersFilePath);
  return JSON.parse(usersData);
};

// Helper function to write users to the JSON file
const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Generate a random token for email verification
const generateToken = () => Math.random().toString(36).substr(2);

// Email verification transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Registration route
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  // Check if the user already exists
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    email,
    password,
    isActive: false,
    verificationToken: generateToken(),
  };

  users.push(newUser);
  writeUsers(users);

  // Send verification email
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: http://localhost:5000/api/verify/${newUser.verificationToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error sending email' });
    }
    res.status(200).json({ message: 'Registration successful. Please check your email for verification link.' });
  });
});

// Email verification route
router.get('/verify/:token', (req, res) => {
  const { token } = req.params;
  const users = readUsers();
  const userIndex = users.findIndex(user => user.verificationToken === token);

  if (userIndex === -1) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  users[userIndex].isActive = true;
  users[userIndex].verificationToken = null;
  writeUsers(users);

  res.status(200).json({ message: 'Email verified successfully' });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(400).json({ message: 'Please verify your email first' });
  }

  res.status(200).json({ message: 'Login successful' });
});

module.exports = router;
