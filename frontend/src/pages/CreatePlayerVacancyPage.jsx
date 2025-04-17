import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

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
                setUserId(parsedUser.id || parsedUser._id);
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

    // Инициализация состояния для всех тем как "Комфортно"
    useEffect(() => {
        const initialComfortState = {};
        Object.values(availableUncomfortableTopics).forEach(topics => {
            topics.forEach(topic => {
                initialComfortState[topic] = "Комфортно";
            });
        });
        setComfortState(initialComfortState);
    }, []);

    const toggleComfortLevel = (topic) => {
        const currentIndex = comfortLevels.indexOf(comfortState[topic] || "Комфортно");
        const newIndex = (currentIndex + 1) % comfortLevels.length;
        setComfortState({ ...comfortState, [topic]: comfortLevels[newIndex] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        if (!token || !userId) {
            console.error("Ошибка: отсутствует токен или ID пользователя.");
            return;
        }

        // Собираем все темы, даже те, что остались "Комфортно"
        const discomfort = [];
        const noDetails = [];
        const comfortable = [];

        Object.entries(comfortState).forEach(([topic, level]) => {
            if (level === "Дискомфортно") {
                discomfort.push(topic);
            } else if (level === "Без подробиць") {
                noDetails.push(topic);
            } else {
                comfortable.push(topic);
            }
        });

        const vacancyData = {
            userId,
            description,
            gameSystem,
            platform,
            age,
            gameType,
            days,
            uncomfortableTopics: {
                discomfort: discomfort.length > 0 ? discomfort : [],
                noDetails: noDetails.length > 0 ? noDetails : [],
                comfortable: comfortable.length > 0 ? comfortable : [],
            },
        };

        try {
            const response = await fetch("http://localhost:3000/api/player-vacancies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(vacancyData)
            });

            if (response.ok) {
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
            <Sidebar />
            <h2>Створення вакансії гравця</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <form onSubmit={handleSubmit} className="vacancy-form">
                <div className="content-wrapper">
                    <div className="left-column">
                        {/* Блок тегов */}
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

                        {/* Блок опису */}
                        <div className="description-section">
                            <h3>Опис</h3>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Опишіть вашу вакансію, вкажіть додаткові побажання чи особливості..."
                                className="description-textarea"
                            />
                        </div>
                    </div>

                    {/* Блок Неприємні теми */}
                    <div className="uncomfortable-topics">
                        <h3>Неприємні теми</h3>
                        {Object.entries(availableUncomfortableTopics).map(([category, topics]) => (
                            <div key={category} className="topic-category">
                                <h4>{category}</h4>
                                <div className="topic-options">
                                    {topics.map((topic) => (
                                        <button
                                            key={topic}
                                            className={`topic-button ${comfortState[topic] === "Дискомфортно" ? "discomfort" : 
                                              comfortState[topic] === "Без подробиць" ? "no-details" : "comfortable"}`}
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
                </div>

                <button type="submit" className="submit-button">Викласти</button>
            </form>
        </div>
    );
};

export default CreatePlayerVacancyPage;