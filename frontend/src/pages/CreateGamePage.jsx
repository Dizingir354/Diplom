import React, { useState, useEffect } from "react";
import Sidebar from "../pages/Sidebar"; // Импортируем Sidebar

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
    });
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        document.getElementById("page-style")?.setAttribute("href", "/css/createGame.css");

        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.userId) {
            setUserId(user.userId);
        } else {
            setErrorMessage("Ошибка: ID пользователя не найден. Перезайдите в аккаунт.");
        }
    }, []);

    const handleTagClick = (category, tag) => {
        setSelectedTags((prev) => {
            if (category === "platforms" || category === "days") {
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
            masters: [userId],
            players: [],
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
            window.location.href = "/parties";
        } catch (error) {
            setErrorMessage("Ошибка: " + error.message);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="create-game-page">
            <Sidebar />

            <div className="create-game-container">
                <div className="game-header">
                    <label className="upload-image">
                        {image ? (
                            <img src={image} alt="Game Preview" />
                        ) : (
                            <span>Завантажити зображення</span>
                        )}
                        <input type="file" onChange={handleImageUpload} hidden />
                    </label>
                </div>

                <div className="game-content">
                    <div className="game-title">
                        <h2>Назва</h2>
                        <input type="text" placeholder="Ваша назва" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="game-description">
                        <h2>Опис</h2>
                        <textarea placeholder="Короткий опис запланованої гри..." value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="game-tags">
                        <h2>Теги</h2>
                        <p>Допоможіть гравцям швидше знайти вашу гру.</p>

                        <h3>Дні</h3>
                        <div className="tags">
                            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс", "За домовленістю"].map((day) => (
                                <button key={day} className={selectedTags.days.includes(day) ? "active" : ""} onClick={() => handleTagClick("days", day)}>
                                    {day}
                                </button>
                            ))}
                        </div>

                        <h3>Тип гри</h3>
                        <div className="tags">
                            {["Кампанія", "Ваншот", "Короткий модуль"].map((type) => (
                                <button key={type} className={selectedTags.gameType === type ? "active" : ""} onClick={() => handleTagClick("gameType", type)}>
                                    {type}
                                </button>
                            ))}
                        </div>

                        <h3>Вік</h3>
                        <div className="tags">
                            {["14+", "16+", "18+", "25+"].map((age) => (
                                <button key={age} className={selectedTags.age === age ? "active" : ""} onClick={() => handleTagClick("age", age)}>
                                    {age}
                                </button>
                            ))}
                        </div>

                        <h3>Платформа</h3>
                        <div className="tags">
                            {["Roll20", "Foundry VTT", "В житті", "Tabletop Simulator", "Другое"].map((platform) => (
                                <button key={platform} className={selectedTags.platforms.includes(platform) ? "active" : ""} onClick={() => handleTagClick("platforms", platform)}>
                                    {platform}
                                </button>
                            ))}
                        </div>

                        <h3>Система</h3>
                        <div className="tags">
                            {["DnD5e", "DnD3.5", "Pathfinder", "VAMPIRE", "Cyberpunk", "Call of Cthulhu"].map((system) => (
                                <button key={system} className={selectedTags.system === system ? "active" : ""} onClick={() => handleTagClick("system", system)}>
                                    {system}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="game-requirements">
                        <h2>Вимоги</h2>
                        <textarea placeholder="Опишіть вимоги до гравців..." value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <button className="submit-button" onClick={handleSubmit}>
                        ВИКЛАСТИ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGamePage;
