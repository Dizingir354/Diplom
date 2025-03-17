import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const MyGamesPage = () => {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Подключаем стили для страницы
    document.getElementById("page-style").setAttribute("href", "/css/myGames.css");

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

  if (!user) {
    return <p>Загрузка...</p>;
  }

  // Фильтруем игры по мастерам/игрокам и по названию (поле title)
  const filteredGames = games
    .filter(game => game.masters.includes(user.id) || game.players.includes(user.id))
    .filter(game => game.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="my-games-container">
      <Sidebar />

      <div className="content">
        <h1 className="page-title">МОЇ ІГРИ</h1>

        {/* Поле поиска */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Пошук гри..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>ПОШУК</button>
        </div>

        {/* Список игр */}
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
                  <p><b>Дата наступної гри:</b> {game.date}</p>
                  <p>{game.description}</p>
                  <button className="join-button">ЗАЙТИ В КІМНАТУ</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-games">У вас поки немає ігор.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGamesPage;
