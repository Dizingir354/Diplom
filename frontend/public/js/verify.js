document.getElementById('verificationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email')?.value?.toLowerCase(); // Здесь у тебя нет поля email в verify.html
    const verificationCode = document.getElementById('code').value; // Исправленный id

    console.log('Отправка данных для верификации:', { email, verificationCode });

    try {
        const response = await fetch('http://localhost:3000/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, verificationCode })
        });

        const data = await response.json();
        console.log('Ответ сервера:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка верификации');
        }

        alert(data.message);
    } catch (error) {
        console.error('Ошибка:', error);
        alert(`Ошибка: ${error.message}`);
    }
});
