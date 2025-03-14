import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const GameListPage = () => {
    const [games, setGames] = useState([]);

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

        fetchGames();
    }, []);

    return (
        <div className="game-page-container">
            <Sidebar />

            <div className="game-list-content">
                <h1 className="page-title">ОГОЛОШЕННЯ</h1>

                <div className="tab-container">
                    <span className="active-tab">МАСТЕРОВ</span>
                    <span className="inactive-tab">ГРАВЦІВ</span>
                </div>

                {games.length > 0 ? (
                    <div className="game-cards">
                        {games.map((game) => (
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

                                    <button className="join-button">ВІДГУКНУТИСЯ</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-games">Ігр поки немає.</p>
                )}
            </div>

            <div className="navigation-buttons">
                <button className="nav-arrow left-arrow">❮</button>
                <button className="nav-arrow right-arrow">❯</button>
            </div>

            <Link to="/games/create" className="create-game-button">
                <img src="/image/gameList/createGame.png" alt="Создать игру" />
            </Link>
        </div>
    );
};

export default GameListPage;
