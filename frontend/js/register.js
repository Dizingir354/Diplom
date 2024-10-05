import { registerUser, verifyEmail } from './api.js'; // Убедитесь, что путь правильный

const registrationForm = document.getElementById('registrationForm');
const verifyButton = document.getElementById('verifyButton');
const verificationSection = document.getElementById('verificationSection');
const verificationCodeInput = document.getElementById('verificationCodeInput');
const emailInput = document.getElementById('emailInput'); // Добавьте это поле для хранения email

registrationForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Отменяем стандартное поведение формы

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    try {
        const data = await registerUser(username, password, email);
        alert(data.message);
        verificationSection.style.display = 'block'; // Показываем секцию для кода
    } catch (error) {
        alert(error.message);
    }
});

// Обработчик для проверки кода
verifyButton.addEventListener('click', async function () {
    const verificationCode = verificationCodeInput.value;
    const email = emailInput.value; // Используем значение email

    try {
        const data = await verifyEmail(email, verificationCode); // Используем правильный путь
        alert(data.message);
        verificationSection.style.display = 'none'; // Скрываем секцию
    } catch (error) {
        alert(error.message);
    }
});
