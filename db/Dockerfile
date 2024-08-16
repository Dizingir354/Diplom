# Используем официальный MongoDB образ
FROM mongo:latest

# Копируем скрипт и файл конфигурации
COPY init.js /docker-entrypoint-initdb.d/

# Открываем стандартный порт MongoDB
EXPOSE 27017
