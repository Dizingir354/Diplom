const fs = require('fs');
const path = require('path');

// Путь к файлу users.json
const filePath = path.join(__dirname, 'users.json');

// Функция для чтения пользователей из файла users.json
const readUsers = () => {
  if (!fs.existsSync(filePath)) {
    // Если файл не существует, возвращаем пустой массив
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Функция для записи пользователей в файл users.json
const writeUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Функция для добавления нового пользователя
const addUser = (user) => {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
};

// Функция для поиска пользователя по email
const findUserByEmail = (email) => {
  const users = readUsers();
  return users.find((user) => user.email === email);
};

// Функция для обновления данных пользователя
const updateUser = (email, updatedData) => {
  const users = readUsers();
  const userIndex = users.findIndex((user) => user.email === email);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedData };
    writeUsers(users);
    return true;
  }
  return false;
};

module.exports = {
  readUsers,
  writeUsers,
  addUser,
  findUserByEmail,
  updateUser,
};
