import { createPlayerVacancy } from './api.js';

document.getElementById('vacancyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const playerName = document.getElementById('playerName').value;
    const description = document.getElementById('description').value;
    const preferredGenres = document.getElementById('preferredGenres').value.split(',').map(genre => genre.trim());

    try {
        const response = await createPlayerVacancy(playerName, description, preferredGenres);
        alert('Вакансия успешно создана!');
        console.log('Данные вакансии:', response);
    } catch (error) {
        console.error('Ошибка при создании вакансии:', error);
        alert(`Ошибка: ${error.message}`);
    }
});
