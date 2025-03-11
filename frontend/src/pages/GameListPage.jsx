import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar"; // Добавляем сайдбар

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
            <Sidebar /> {/* Добавляем сайдбар */}
            
            <div className="game-list-content">
                <h1>Список игр</h1>

                {games.length > 0 ? (
                    <div className="game-cards">
                        {games.map((game) => (
                            <div key={game._id} className="game-card">
                                <h2>{game.title}</h2>
                                <p className="game-description">{game.description}</p>
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
                                <button className="join-button">Присоединиться</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-games">Игр пока нет.</p>
                )}
            </div>

            {/* Кнопка для создания игры теперь в правом верхнем углу */}
            <Link to="/games/create" className="create-game-button">
                <img src="/image/gameList/createGame.png" alt="Создать игру" />
            </Link>
        </div>
    );
};

export default GameListPage;
