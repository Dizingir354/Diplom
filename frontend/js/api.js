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

export { registerUser, verifyEmail };
