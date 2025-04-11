import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const UserGamesPage = () => {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/myGames.css");

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем пользователя
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Загружаем игры
        const response = await fetch("http://localhost:3000/api/parties");
        if (!response.ok) throw new Error("Ошибка загрузки игр");
        
        const data = await response.json();
        setGames(Array.isArray(data) ? data : []);

      } catch (error) {
        console.error("Ошибка:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredGames = games.filter(game => {
    // Безопасная проверка массивов masters и players
    const masters = Array.isArray(game?.masters) ? game.masters : [];
    const players = Array.isArray(game?.players) ? game.players : [];
    
    return (user?.id && (masters.includes(user.id) || players.includes(user.id))) &&
           game.title?.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!user) return <div className="no-user">Пользователь не загружен</div>;

  return (
    <div className="my-games-container">
      <Sidebar />

      <div className="content">
        <h1 className="page-title">МОЇ ІГРИ</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Пошук гри..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>ПОШУК</button>
        </div>

        <div className="game-list">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div key={game._id} className="game-card">
                <img
                  src={game.image || "/image/gameList/default.jpg"}
                  alt={game.title}
                  className="game-image"
                />
                <div className="game-info">
                  <h2>{game.title}</h2>
                  <p><b>Дата наступної гри:</b> {game.date || "Не вказано"}</p>
                  <p>{game.description || "Опис відсутній"}</p>
                  <button
                    className="join-button"
                    onClick={() => navigate(`/party/${game._id}`)}
                  >
                    ЗАЙТИ В КІМНАТУ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-games">
              {search ? "Нічого не знайдено" : "У вас поки немає ігор."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGamesPage;