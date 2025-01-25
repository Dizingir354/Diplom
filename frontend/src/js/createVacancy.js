// createVacancy.js
import api from './api.js'; // импортируем весь объект

console.log('createVacancy.js подключён');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vacancyForm');
    const responseMessage = document.getElementById('responseMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Останавливаем стандартное поведение формы

        // Собираем данные из формы
        const playerName = form.playerName.value.trim();
        const description = form.description.value.trim();
        const preferredGenres = form.preferredGenres.value.trim();

        try {
            // Вызываем API для создания вакансии
            const result = await api.createPlayerVacancy(playerName, description, preferredGenres);

            // Если успешно, показываем сообщение
            responseMessage.textContent = 'Вакансия успешно создана!';
            responseMessage.style.color = 'green';

            // Очищаем форму
            form.reset();
        } catch (error) {
            // Показываем сообщение об ошибке
            responseMessage.textContent = `Ошибка: ${error.message}`;
            responseMessage.style.color = 'red';
        }
    });
});
