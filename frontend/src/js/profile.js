document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Загрузка данных профиля
        const response = await fetch('http://localhost:3000/api/profile');
        const data = await response.json();

        if (response.ok) {
            document.getElementById('username').value = data.username;
            document.getElementById('role').value = data.role || '';

            const gamesList = document.getElementById('gamesList');
            data.games.forEach(game => {
                const li = document.createElement('li');
                li.textContent = game;
                gamesList.appendChild(li);
            });
        } else {
            throw new Error(data.message || 'Ошибка загрузки профиля');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert(`Ошибка: ${error.message}`);
    }
});

// Обработка сохранения профиля
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('avatar', document.getElementById('avatar').files[0]);
    formData.append('role', document.getElementById('role').value);

    try {
        const response = await fetch('http://localhost:3000/api/profile', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка сохранения профиля');
        }

        alert('Профиль успешно сохранён');
    } catch (error) {
        console.error('Ошибка:', error);
        alert(`Ошибка: ${error.message}`);
    }
});
