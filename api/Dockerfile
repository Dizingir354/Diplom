# Используем официальный Node.js образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь код
COPY . .

# Открываем порт 5000
EXPOSE 5000

# Команда для запуска приложения
CMD [ "npm", "start" ]
