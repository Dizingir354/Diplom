import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import PlayerVacanciesPage from "./PlayerVacanciesPage";

const GameListPage = () => {
    const [games, setGames] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const gamesPerPage = 3;
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("МАСТЕРОВ");

    useEffect(() => {
        document.getElementById("page-style").setAttribute("href", "/css/gameList.css");

        const fetchGames = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/parties");
                const data = await response.json();
                setGames(data);
            } catch (error) {
                console.error("Ошибка загрузки игр:", error);
            }
        };

        const fetchUser = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };

        fetchGames();
        fetchUser();
    }, []);

    const nextPage = () => {
        if ((currentPage + 1) * gamesPerPage < games.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleJoinGame = async (gameId, masters, players) => {
        if (!user || !user.id) {
            alert("Вам нужно войти в аккаунт!");
            return;
        }

        if (masters.includes(user.id) || players.includes(user.id)) {
            alert("Вы уже участвуете в этой игре!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/parties/${gameId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerId: user.id })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Вы успешно присоединились к игре!");
                setGames((prevGames) =>
                    prevGames.map((game) =>
                        game._id === gameId ? { ...game, players: [...game.players, user.id] } : game
                    )
                );
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Ошибка при вступлении в игру:", error);
            alert("Ошибка подключения к серверу.");
        }
    };

    const visibleGames = games.slice(currentPage * gamesPerPage, (currentPage + 1) * gamesPerPage);

    return (
        <div className="game-page-container">
            <Sidebar />

            <div className="game-list-content">
                <h1 className="page-title">ОГОЛОШЕННЯ</h1>

                <div className="tab-container">
                    <span
                        className={activeTab === "МАСТЕРОВ" ? "active-tab" : "inactive-tab"}
                        onClick={() => setActiveTab("МАСТЕРОВ")}
                    >
                        МАСТЕРОВ
                    </span>
                    <span
                        className={activeTab === "ГРАВЦІВ" ? "active-tab" : "inactive-tab"}
                        onClick={() => setActiveTab("ГРАВЦІВ")}
                    >
                        ГРАВЦІВ
                    </span>
                </div>

                {activeTab === "МАСТЕРОВ" ? (
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
                                            <div className="game-time">
                                                <p><b>Час:</b> {game.time}</p>
                                            </div>

                                            <div className="game-tags">
                                                {game.tags && Object.keys(game.tags).length > 0 ? (
                                                    Object.keys(game.tags).map((category) =>
                                                        game.tags[category].map((tag) => (
                                                            <span key={tag} className="game-tag">
                                                                {tag}
                                                            </span>
                                                        ))
                                                    )
                                                ) : (
                                                    <p className="no-tags">Теги не заданы</p>
                                                )}
                                            </div>

                                            <div className="game-requirements">
                                                <p><b>Вимоги:</b> {game.requirements || "Не указаны"}</p>
                                            </div>

                                            <div className="game-description">
                                                <p>{game.description}</p>
                                            </div>

                                            <div className="game-players">
                                                <p>Количество игроков: {game.players.length} из {game.maxPlayers}</p>
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

                        <div className="navigation-buttons">
                            <button className="nav-arrow left-arrow" onClick={prevPage} disabled={currentPage === 0}>
                                ❮
                            </button>
                            <button className="nav-arrow right-arrow" onClick={nextPage} disabled={(currentPage + 1) * gamesPerPage >= games.length}>
                                ❯
                            </button>
                        </div>

                        <Link to="/games/create" className="create-game-button">
                            <img src="/image/gameList/createGame.png" alt="Создать игру" />
                        </Link>
                    </>
                ) : (
                    <PlayerVacanciesPage />
                )}
            </div>
        </div>
    );
};

export default GameListPage;
