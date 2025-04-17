import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const GameListPage = () => {
    const [games, setGames] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [activeTab, setActiveTab] = useState("МАСТЕРА");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState({ games: true, vacancies: true });

    const gamesPerPage = 3;
    const vacanciesPerPage = 8;

    useEffect(() => {
        document.getElementById("page-style").setAttribute("href", "/css/gameList.css");
    }, []);

    const fetchGames = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, games: true }));
            const response = await fetch("http://localhost:3000/api/parties");
            if (!response.ok) throw new Error("Ошибка загрузки игр");
            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error("Ошибка загрузки игр:", error);
        } finally {
            setLoading(prev => ({ ...prev, games: false }));
        }
    }, []);

    const fetchVacancies = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, vacancies: true }));
            const response = await fetch("http://localhost:3000/api/player-vacancies");
            if (!response.ok) throw new Error("Ошибка загрузки вакансий");
            const data = await response.json();
            setVacancies(data);
        } catch (error) {
            console.error("Ошибка загрузки вакансий игроков:", error);
        } finally {
            setLoading(prev => ({ ...prev, vacancies: false }));
        }
    }, []);

    const fetchUser = useCallback(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({
                    ...parsedUser,
                    _id: parsedUser.id
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
            setCurrentPage(prev => prev + 1);
        } else if (activeTab === "ГРАВЦІ" && (currentPage + 1) * vacanciesPerPage < vacancies.length) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
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
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ playerId: user._id })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Вы успешно присоединились к игре!");
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

    const renderGameTags = (game) => {
        if (!game.tags) return <p className="no-tags">Теги не вказані</p>;
        
        return (
            <>
                {game.tags.days?.map((tag) => (
                    <span key={`days-${tag}`} className="game-tag">{tag}</span>
                ))}
                {game.tags.gameType?.map((tag) => (
                    <span key={`type-${tag}`} className="game-tag">{tag}</span>
                ))}
                {game.tags.age?.map((tag) => (
                    <span key={`age-${tag}`} className="game-tag">{tag}</span>
                ))}
                {game.tags.platforms?.map((tag) => (
                    <span key={`platform-${tag}`} className="game-tag">{tag}</span>
                ))}
                {game.tags.system?.map((tag) => (
                    <span key={`system-${tag}`} className="game-tag">{tag}</span>
                ))}
                {game.tags.otherTags?.map((tag) => (
                    <span key={`other-${tag}`} className="game-tag">{tag}</span>
                ))}
            </>
        );
    };

    const renderVacancyTags = (vacancy) => {
        const tags = [];
        if (vacancy.gameSystem) tags.push(vacancy.gameSystem);
        if (vacancy.platform) tags.push(vacancy.platform);
        if (vacancy.age) tags.push(vacancy.age);
        if (vacancy.gameType) tags.push(vacancy.gameType);
        if (vacancy.days) tags.push(...vacancy.days);

        if (tags.length === 0) return <p className="no-tags">Теги не вказані</p>;

        return tags.map((tag, index) => (
            <span key={`tag-${index}`} className="tag">{tag}</span>
        ));
    };

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

                {loading.games && loading.vacancies ? (
                    <div className="loading">Завантаження...</div>
                ) : activeTab === "МАСТЕРА" ? (
                    <>
                        {visibleGames.length > 0 ? (
                            <div className="game-cards">
                                {visibleGames.map((game) => (
                                    <div key={game._id} className="game-card">
                                        <div className="game-header">
                                            <img src="/image/gameList/avatar.png" alt="Avatar" className="game-avatar" />
                                            <div className="game-host">
                                                <h2 className="host-name">
                                                    {game.masters?.[0]?.username || "Майстер"}
                                                </h2>
                                                {game.masters?.[0]?.online && (
                                                    <span className="online-indicator"></span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="game-image">
                                            <img src="/image/gameList/game-placeholder.png" alt="Game" />
                                        </div>

                                        <div className="game-info">
                                            <p><b>Назва:</b> {game.title}</p>
                                            {game.days?.length > 0 && (
                                                <p><b>Дні:</b> {game.days.join(', ')}</p>
                                            )}
                                            <div className="game-tags">
                                                {renderGameTags(game)}
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
                                                <h2>{vacancy.creator?.username || "Гравець"}</h2>
                                                {vacancy.creator?.online && (
                                                    <span className="online-indicator"></span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="vacancy-info">
                                            <p className="vacancy-description">{vacancy.description}</p>
                                            {vacancy.days?.length > 0 && (
                                                <p><b>Дні:</b> {vacancy.days.join(', ')}</p>
                                            )}
                                            <div className="vacancy-tags">
                                                {renderVacancyTags(vacancy)}
                                            </div>
                                            <Link to={`/player-vacancy/${vacancy._id}`} className="view-button">
                                                Переглянути
                                            </Link>
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
                    <button 
                        className="nav-arrow left-arrow" 
                        onClick={prevPage} 
                        disabled={currentPage === 0}
                    >
                        ❮
                    </button>
                    <button 
                        className="nav-arrow right-arrow" 
                        onClick={nextPage} 
                        disabled={
                            (currentPage + 1) * (activeTab === "МАСТЕРА" ? gamesPerPage : vacanciesPerPage) >= 
                            (activeTab === "МАСТЕРА" ? games.length : vacancies.length)
                        }
                    >
                        ❯
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameListPage;