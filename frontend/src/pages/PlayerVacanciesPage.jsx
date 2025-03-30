import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../pages/Sidebar";

const PlayerVacanciesPage = () => {
    const [vacancies, setVacancies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [activeTab, setActiveTab] = useState("ГРАВЦІ"); // Состояние активной вкладки
    const vacanciesPerPage = 8;

    useEffect(() => {
        document.getElementById("page-style").setAttribute("href", "/css/playerVacancies.css");

        const fetchVacancies = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/player-vacancies");
                const data = await response.json();
                setVacancies(data);
            } catch (error) {
                console.error("Ошибка загрузки вакансий игроков:", error);
            }
        };

        fetchVacancies();
    }, []);

    const nextPage = () => {
        if ((currentPage + 1) * vacanciesPerPage < vacancies.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const visibleVacancies = vacancies.slice(currentPage * vacanciesPerPage, (currentPage + 1) * vacanciesPerPage);

    return (
        <div className="player-vacancies-page">
            <Sidebar />
            <div className="content">
                <h1 className="page-title">ОГОЛОШЕННЯ</h1>

                {/* Переключение вкладок */}
                <div className="tabs">
                    <span className={`tab ${activeTab === "МАЙСТРИ" ? "active" : "inactive"}`}
                          onClick={() => setActiveTab("МАЙСТРИ")}>
                        МАЙСТРИ
                    </span>
                    <span className={`tab ${activeTab === "ГРАВЦІ" ? "active" : "inactive"}`}
                          onClick={() => setActiveTab("ГРАВЦІ")}>
                        ГРАВЦІВ
                    </span>
                </div>

                {activeTab === "ГРАВЦІ" && (
                    visibleVacancies.length > 0 ? (
                        <div className="vacancies-container">
                            {visibleVacancies.map((vacancy) => (
                                <div key={vacancy._id} className="vacancy-card">
                                    <div className="vacancy-header">
                                        <img src="/image/gameList/avatar.png" alt="Avatar" className="vacancy-avatar" />
                                        <div className="vacancy-name">
                                            <h2>{vacancy.playerName}</h2>
                                            <span className="online-indicator"></span>
                                        </div>
                                    </div>

                                    <div className="vacancy-info">
                                        <p className="vacancy-description">{vacancy.description}</p>

                                        <div className="vacancy-tags">
                                            {vacancy.tags?.length > 0 ? (
                                                vacancy.tags.map((tag) => (
                                                    <span key={tag} className="tag">{tag}</span>
                                                ))
                                            ) : (
                                                <p className="no-tags">Теги не вказані</p>
                                            )}
                                        </div>

                                        <button className="view-button">Переглянути</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-vacancies">Вакансій поки немає.</p>
                    )
                )}

                {/* Кнопки навигации */}
                <div className="navigation-buttons">
                    <button className="nav-arrow left-arrow" onClick={prevPage} disabled={currentPage === 0}>
                        ❮
                    </button>
                    <button className="nav-arrow right-arrow" onClick={nextPage} disabled={(currentPage + 1) * vacanciesPerPage >= vacancies.length}>
                        ❯
                    </button>
                </div>

                {/* Кнопка создания вакансии (плюсик) */}
                <Link to="/player-vacancies/create" className="create-vacancy-button">
                    <img src="/mnt/data/image.png" alt="Создать вакансию" />
                </Link>
            </div>
        </div>
    );
};

export default PlayerVacanciesPage;
