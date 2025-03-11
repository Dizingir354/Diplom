import React, { useState, useEffect } from "react";

const CreateGamePage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [selectedTags, setSelectedTags] = useState({
        days: [],
        gameType: "",
        age: "",
        platforms: [],
        system: "",
        otherTags: [],
    });
    const [userId, setUserId] = useState(null); // ID пользователя
    const [errorMessage, setErrorMessage] = useState(""); // Ошибки

    useEffect(() => {
        document.getElementById("page-style").setAttribute("href", "/css/createGame.css");

        // Загружаем userId из localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.userId) {
            setUserId(user.userId);
        } else {
            setErrorMessage("Ошибка: ID пользователя не найден. Перезайдите в аккаунт.");
        }
    }, []);

    const handleTagClick = (category, tag) => {
        setSelectedTags((prev) => {
            if (category === "platforms" || category === "otherTags" || category === "days") {
                return {
                    ...prev,
                    [category]: prev[category].includes(tag)
                        ? prev[category].filter((t) => t !== tag)
                        : [...prev[category], tag],
                };
            }
            return {
                ...prev,
                [category]: prev[category] === tag ? "" : tag,
            };
        });
    };

    const validateForm = () => {
        if (!title || !description || !requirements || !selectedTags.gameType || !selectedTags.age || !selectedTags.system || selectedTags.days.length === 0) {
            setErrorMessage("Заполните все обязательные поля.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        if (!userId) return;

        const gameData = {
            title,
            description,
            requirements,
            days: selectedTags.days,
            gameType: selectedTags.gameType,
            age: selectedTags.age,
            platforms: selectedTags.platforms,
            system: selectedTags.system,
            otherTags: selectedTags.otherTags,
            masters: [userId], // Передаём мастера
            players: [], // Передаём пустой массив игроков
        };

        console.log("Отправляемые данные:", gameData);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/parties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(gameData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert("Игра успешно создана!");
            window.location.href = "/parties"; // Перенаправление на список игр
        } catch (error) {
            setErrorMessage("Ошибка: " + error.message);
        }
    };

    return (
        <div className="create-game-container">
            <h1>Создание Игры</h1>
            <input type="text" placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Описание игры..." value={description} onChange={(e) => setDescription(e.target.value)} />
            <textarea placeholder="Требования к игрокам..." value={requirements} onChange={(e) => setRequirements(e.target.value)} />

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="tags-section">
                <h3>Дни недели</h3>
                <div className="tags">
                    {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс", "За договорённостью"].map((day) => (
                        <button key={day} className={selectedTags.days.includes(day) ? "active" : ""} onClick={() => handleTagClick("days", day)}>
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tags-section">
                <h3>Тип игры</h3>
                <div className="tags">
                    {["Кампания", "Ваншот", "Короткий модуль"].map((type) => (
                        <button key={type} className={selectedTags.gameType === type ? "active" : ""} onClick={() => handleTagClick("gameType", type)}>
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tags-section">
                <h3>Возрастные ограничения</h3>
                <div className="tags">
                    {["14+", "16+", "18+", "25+"].map((age) => (
                        <button key={age} className={selectedTags.age === age ? "active" : ""} onClick={() => handleTagClick("age", age)}>
                            {age}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tags-section">
                <h3>Платформы</h3>
                <div className="tags">
                    {["Roll20", "Foundry", "D20Pro", "Discord", "Другие"].map((platform) => (
                        <button key={platform} className={selectedTags.platforms.includes(platform) ? "active" : ""} onClick={() => handleTagClick("platforms", platform)}>
                            {platform}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tags-section">
                <h3>Система</h3>
                <div className="tags">
                    {["DnD 5e", "Pathfinder", "World of Darkness", "Другие"].map((system) => (
                        <button key={system} className={selectedTags.system === system ? "active" : ""} onClick={() => handleTagClick("system", system)}>
                            {system}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tags-section">
                <h3>Другие теги</h3>
                <div className="tags">
                    {["РП", "Экшен", "Стратегия", "Пазл", "Мифология"].map((tag) => (
                        <button key={tag} className={selectedTags.otherTags.includes(tag) ? "active" : ""} onClick={() => handleTagClick("otherTags", tag)}>
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                Выложить
            </button>
        </div>
    );
};

export default CreateGamePage;
