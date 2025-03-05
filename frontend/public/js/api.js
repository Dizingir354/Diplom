const API_BASE_URL = "http://localhost:3000/api";

// Получаем токен из localStorage
const getToken = () => localStorage.getItem("token");

const request = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    // Если токен истёк или недействителен — выходим
    if (response.status === 401) {
        logoutUser(); 
        throw new Error("Сессия истекла, выполните вход заново.");
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Ошибка запроса");
    }

    return data;
};


// Регистрация
const registerUser = (username, password, email) =>
    request("/register", {
        method: "POST",
        body: JSON.stringify({ username, password, email }),
    });

// Авторизация (вход)
const loginUser = async (email, password) => {
    const data = await request("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    // Сохраняем токен
    localStorage.setItem("token", data.token);
    return data;
};

// Выход
const logoutUser = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};

// Создание вакансии игрока (пример запроса с токеном)
const createPlayerVacancy = async (playerName, description, preferredGenres) => {
    return request("/player-vacancies", {
        method: "POST",
        body: JSON.stringify({ playerName, description, preferredGenres }),
    });
};

export default { registerUser, loginUser, logoutUser, createPlayerVacancy };
