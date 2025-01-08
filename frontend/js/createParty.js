import api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('partyForm');
    const responseMessage = document.getElementById('responseMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Сбор данных из формы
        const title = form.title.value.trim();
        const description = form.description.value.trim();
        const genres = form.genres.value.split(',').map(genre => genre.trim());
        const masters = form.masters.value.split(',').map(master => master.trim());
        const players = form.players.value.split(',').map(player => player.trim());

        try {
            // Отправляем данные на сервер
            const result = await api.createParty({ title, description, genres, masters, players });

            // Если успешно, отображаем сообщение
            responseMessage.textContent = 'Партия успешно создана!';
            responseMessage.style.color = 'green';

            // Очищаем форму
            form.reset();
        } catch (error) {
            // В случае ошибки отображаем сообщение
            responseMessage.textContent = `Ошибка: ${error.message}`;
            responseMessage.style.color = 'red';
        }
    });
});
