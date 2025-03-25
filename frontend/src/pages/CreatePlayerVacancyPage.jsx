import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreatePlayerVacancyPage = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [gameSystem, setGameSystem] = useState("");
    const [platform, setPlatform] = useState("");
    const [age, setAge] = useState("");
    const [gameType, setGameType] = useState("");
    const [days, setDays] = useState([]);
    const [comfortLevels] = useState(["Дискомфортно", "Без подробиць", "Комфортно"]);
    const [comfortState, setComfortState] = useState({});

    const [userId, setUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        document.getElementById("page-style")?.setAttribute("href", "/css/CreatePlayerVacancyPage.css");

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserId(parsedUser.id || parsedUser._id); // Поддержка разных форматов ID
            } catch (error) {
                console.error("Ошибка парсинга данных пользователя:", error);
            }
        } else {
            setErrorMessage("Ошибка: вы не авторизованы.");
        }
    }, []);

    const availableDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс", "За домовленістю"];
    const availableGameTypes = ["Кампанія", "Ваншот", "Короткий модуль"];
    const availableAges = ["14+", "16+", "18+", "25+"];
    const availablePlatforms = ["Roll20", "Foundry VTT", "В житті", "Tabletop Simulator", "Другое"];
    const availableGameSystems = ["DnD5e", "DnD3.5", "Pathfinder", "VAMPIRE", "Cyberpunk", "Call of Cthulhu", "інше"];
    const availableUncomfortableTopics = {
        "Фобії": ["Кров", "Клаустрофобія", "Глибина", "Розчленування", "Трипофобія", "Комахи"],
        "Відносини": ["Детальний опис 18+", "Сексуальні девіації", "Участь у відносинах персонажів гравців"],
        "Проблеми соціальні": ["Дискримінація", "Канібалізм", "Рабство", "Тероризм", "Геноцид", "Катування"]
    };

    const toggleComfortLevel = (topic) => {
        const currentIndex = comfortLevels.indexOf(comfortState[topic] || "Комфортно");
        const newIndex = (currentIndex + 1) % comfortLevels.length;
        setComfortState({ ...comfortState, [topic]: comfortLevels[newIndex] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Ошибка: Токен отсутствует! Пользователь не авторизован.");
            return;
        }

        if (!userId) {
            console.error("Ошибка: отсутствует ID пользователя.");
            return;
        }

        const discomfort = Object.keys(comfortState).filter(topic => comfortState[topic] === "Дискомфортно");
        const noDetails = Object.keys(comfortState).filter(topic => comfortState[topic] === "Без подробиць");
        const comfortable = Object.keys(comfortState).filter(topic => comfortState[topic] === "Комфортно");

        const vacancyData = {
            userId, 
            description,
            gameSystem,
            platform,
            age,
            gameType,
            days,
            uncomfortableTopics: {
                discomfort: discomfort.length > 0 ? discomfort : null,
                noDetails: noDetails.length > 0 ? noDetails : null,
                comfortable: comfortable.length > 0 ? comfortable : null,
            },
        };


        try {
            console.log("Отправляемые данные:", JSON.stringify(vacancyData, null, 2));

            const response = await fetch("http://localhost:3000/api/player-vacancies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(vacancyData)
            });

            if (response.ok) {
                console.log("Вакансия создана");
                navigate("/profile");
            } else {
                const errorData = await response.json();
                console.error("Ошибка при создании", errorData);
            }
        } catch (error) {
            console.error("Ошибка запроса", error);
        }
    };

    return (
        <div className="create-vacancy-container">
            <div className="background-overlay"></div>
            <h2>Створення вакансії гравця</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="vacancy-form">
                <div className="tags-section">
                    <h3>Теги</h3>
                    <div className="tags-group">
                        <h4>Система</h4>
                        {availableGameSystems.map((sys) => (
                            <button key={sys} className={gameSystem === sys ? "selected" : ""} onClick={(e) => {
                                e.preventDefault();
                                setGameSystem(sys);
                            }}>{sys}</button>
                        ))}
                    </div>

                    <div className="tags-group">
                        <h4>Платформа</h4>
                        {availablePlatforms.map((plat) => (
                            <button key={plat} className={platform === plat ? "selected" : ""} onClick={(e) => {
                                e.preventDefault();
                                setPlatform(plat);
                            }}>{plat}</button>
                        ))}
                    </div>

                    <div className="tags-group">
                        <h4>Вік</h4>
                        {availableAges.map((ageOpt) => (
                            <button key={ageOpt} className={age === ageOpt ? "selected" : ""} onClick={(e) => {
                                e.preventDefault();
                                setAge(ageOpt);
                            }}>{ageOpt}</button>
                        ))}
                    </div>

                    <div className="tags-group">
                        <h4>Тип гри</h4>
                        {availableGameTypes.map((type) => (
                            <button key={type} className={gameType === type ? "selected" : ""} onClick={(e) => {
                                e.preventDefault();
                                setGameType(type);
                            }}>{type}</button>
                        ))}
                    </div>

                    <div className="tags-group">
                        <h4>Дні</h4>
                        {availableDays.map((day) => (
                            <button key={day} className={days.includes(day) ? "selected" : ""} onClick={(e) => {
                                e.preventDefault();
                                setDays(days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);
                            }}>{day}</button>
                        ))}
                    </div>
                </div>

                <div className="description-section">
                    <h3>Опис</h3>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className="uncomfortable-topics">
                    <h3>Неприємні теми</h3>
                    {Object.entries(availableUncomfortableTopics).map(([category, topics]) => (
                        <div key={category} className="topic-category">
                            <h4>{category}</h4>
                            <div className="topic-options">
                                {topics.map((topic) => (
                                    <button
                                        key={topic}
                                        className={`topic-button ${comfortState[topic] === "Дискомфортно" ? "selected" : ""}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleComfortLevel(topic);
                                        }}
                                    >
                                        {topic} ({comfortState[topic] || "Комфортно"})
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" className="submit-button">Викласти</button>
            </form>
        </div>
    );
};

export default CreatePlayerVacancyPage;
