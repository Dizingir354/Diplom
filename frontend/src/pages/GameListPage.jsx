import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const GameListPage = () => {
    const [games, setGames] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [activeTab, setActiveTab] = useState("МАСТЕРА");
    const [user, setUser] = useState(null);

    const gamesPerPage = 3;
    const vacanciesPerPage = 8;

    useEffect(() => {
        document.getElementById("page-style").setAttribute("href", "/css/gameList.css");
    }, []);

    const fetchGames = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3000/api/parties");
            if (!response.ok) throw new Error("Ошибка загрузки игр");
            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error("Ошибка загрузки игр:", error);
        }
    }, []);

    const fetchVacancies = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3000/api/player-vacancies");
            const data = await response.json();
            setVacancies(data);
        } catch (error) {
            console.error("Ошибка загрузки вакансий игроков:", error);
        }
    }, []);

    const fetchUser = useCallback(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({
                    ...parsedUser,
                    _id: parsedUser.id // Исправляем: используем id как _id
                });
            } catch (e) {
                console.error("Ошибка парсинга пользователя:", e);
            }
        }
    }, []);

    useEffect(() => {
        fetchGames();
        fetchVacancies();
        fetchUser();
    }, [fetchGames, fetchVacancies, fetchUser]);

    const nextPage = () => {
        if (activeTab === "МАСТЕРА" && (currentPage + 1) * gamesPerPage < games.length) {
            setCurrentPage((prev) => prev + 1);
        } else if (activeTab === "ГРАВЦІ" && (currentPage + 1) * vacanciesPerPage < vacancies.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleJoinGame = async (gameId, masters, players) => {
        if (!user?._id) {
            alert("Вам нужно войти в аккаунт!");
            return;
        }

        if (masters.includes(user._id) || players.includes(user._id)) {
            alert("Вы уже участвуете в этой игре!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/parties/${gameId}/join`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Добавляем токен авторизации
                },
                body: JSON.stringify({ playerId: user._id })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Вы успешно присоединились к игре!");
                // Обновляем список игр
                setGames(prevGames => 
                    prevGames.map(game => 
                        game._id === gameId 
                            ? { ...game, players: [...game.players, user._id] } 
                            : game
                    )
                );
            } else {
                alert(result.message || "Ошибка при присоединении");
            }
        } catch (error) {
            console.error("Ошибка при вступлении в игру:", error);
            alert("Ошибка подключения к серверу.");
        }
    };

    const visibleGames = games.slice(currentPage * gamesPerPage, (currentPage + 1) * gamesPerPage);
    const visibleVacancies = vacancies.slice(currentPage * vacanciesPerPage, (currentPage + 1) * vacanciesPerPage);

    return (
        <div className="game-page-container">
            <Sidebar />

            <div className="game-list-content">
                <h1 className="page-title">ОГОЛОШЕННЯ</h1>

                <div className="tab-container">
                    <span
                        className={activeTab === "МАСТЕРА" ? "active-tab" : "inactive-tab"}
                        onClick={() => {
                            setActiveTab("МАСТЕРА");
                            setCurrentPage(0);
                        }}
                    >
                        МАСТЕРОВ
                    </span>
                    <span
                        className={activeTab === "ГРАВЦІ" ? "active-tab" : "inactive-tab"}
                        onClick={() => {
                            setActiveTab("ГРАВЦІ");
                            setCurrentPage(0);
                        }}
                    >
                        ГРАВЦІВ
                    </span>
                </div>

                {activeTab === "МАСТЕРА" ? (
                    <>
                        {visibleGames.length > 0 ? (
                            <div className="game-cards">
                                {visibleGames.map((game) => (
                                    <div key={game._id} className="game-card">
                                        <div className="game-header">
                                            <img src="/image/gameList/avatar.png" alt="Avatar" className="game-avatar" />
                                            <div className="game-host">
                                                <h2 className="host-name">{game.host}</h2>
                                                <span className="online-indicator"></span>
                                            </div>
                                        </div>

                                        <div className="game-image">
                                            <img src="/image/gameList/game-placeholder.png" alt="Game Image" />
                                        </div>

                                        <div className="game-info">
                                            <p><b>Час:</b> {game.time}</p>
                                            <div className="game-tags">
                                                {game.tags?.length ? (
                                                    game.tags.map((tag) => (
                                                        <span key={tag} className="game-tag">{tag}</span>
                                                    ))
                                                ) : (
                                                    <p className="no-tags">Теги не вказані</p>
                                                )}
                                            </div>
                                            <button 
                                                className="join-button" 
                                                onClick={() => handleJoinGame(game._id, game.masters, game.players)}
                                            >
                                                ВІДГУКНУТИСЯ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-games">Ігр поки немає.</p>
                        )}
                    </>
                ) : (
                    <>
                        {visibleVacancies.length > 0 ? (
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
                                                {vacancy.tags?.length ? (
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
                        )}
                    </>
                )}

                <div className="create-game-container">
                    <Link to={activeTab === "МАСТЕРА" ? "/games/create" : "/player-vacancies/create"} className="create-game-button">
                        <img src="/image/gameList/createGame.png" alt="Добавить" />
                    </Link>
                </div>

                <div className="navigation-buttons">
                    <button className="nav-arrow left-arrow" onClick={prevPage} disabled={currentPage === 0}>❮</button>
                    <button className="nav-arrow right-arrow" onClick={nextPage} disabled={(currentPage + 1) * (activeTab === "МАСТЕРА" ? gamesPerPage : vacanciesPerPage) >= (activeTab === "МАСТЕРА" ? games.length : vacancies.length)}>❯</button>
                </div>
            </div>
        </div>
    );
};

export default GameListPage;