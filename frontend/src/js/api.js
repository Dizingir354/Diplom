// api.js
const API_BASE_URL = 'http://localhost:3000/api';

const registerUser = async (username, password, email) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    });

    if (!response.ok) {
        throw new Error('Ошибка при регистрации пользователя');
    }

    return response.json();
};

const verifyEmail = async (email, verificationCode) => {
    const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, verificationCode })
    });

    if (!response.ok) {
        throw new Error('Ошибка при подтверждении email');
    }

    return response.json();
};

const createPlayerVacancy = async (playerName, description, preferredGenres) => {
    const response = await fetch(`${API_BASE_URL}/player-vacancies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName, description, preferredGenres })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании вакансии игрока');
    }

    return response.json();
};

const createParty = async ({ title, description, genres, masters, players }) => {
    const response = await fetch(`${API_BASE_URL}/parties`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, genres, masters, players })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании партии');
    }

    return response.json();
};

export default { registerUser, verifyEmail, createPlayerVacancy, createParty };