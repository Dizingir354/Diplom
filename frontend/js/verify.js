document.getElementById('verifyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const verificationCode = document.getElementById('verificationCode').value;

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