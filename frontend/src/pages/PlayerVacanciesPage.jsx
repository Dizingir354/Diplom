import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PlayerVacanciesPage = () => {
    const [vacancies, setVacancies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const vacanciesPerPage = 3;

    useEffect(() => {
        document.getElementById("page-style").setAttribute("href", "/css/gameList.css");

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
        <div className="game-page-container">
            <div className="game-list-content">
                <h1 className="page-title">Вакансії гравців</h1>

                {visibleVacancies.length > 0 ? (
                    <div className="game-cards">
                        {visibleVacancies.map((vacancy) => (
                            <div key={vacancy._id} className="game-card">
                                <div className="game-header">
                                    <img src="/image/gameList/avatar.png" alt="Avatar" className="game-avatar" />
                                    <div className="host-name">
                                        <h2>{vacancy.playerName}</h2>
                                        <span className="online-indicator"></span>
                                    </div>
                                </div>

                                <div className="game-info">
                                    <p>{vacancy.description}</p>

                                    <div className="game-tags">
                                        {vacancy.tags && vacancy.tags.length > 0 ? (
                                            vacancy.tags.map((tag) => (
                                                <span key={tag} className="game-tag">
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="no-tags">Теги не вказані</p>
                                        )}
                                    </div>

                                    <button className="join-button">ЗВ'ЯЗАТИСЯ</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-vacancies">Вакансій поки немає.</p>
                )}

                <div className="navigation-buttons">
                    <button className="nav-arrow left-arrow" onClick={prevPage} disabled={currentPage === 0}>
                        ❮
                    </button>
                    <button className="nav-arrow right-arrow" onClick={nextPage} disabled={(currentPage + 1) * vacanciesPerPage >= vacancies.length}>
                        ❯
                    </button>
                </div>

                {/* Кнопка создания вакансии игрока */}
                <Link to="/player-vacancies/create" className="create-game-button">
                    <img src="/image/gameList/createGame.png" alt="Создать вакансию игрока" />
                </Link>
            </div>
        </div>
    );
};

export default PlayerVacanciesPage;
