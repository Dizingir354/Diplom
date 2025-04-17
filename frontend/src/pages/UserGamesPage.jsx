import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const UserGamesPage = () => {
  const [games, setGames] = useState([]);
  const [vacancies, setVacancies] = useState([]);
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

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          const [partiesRes, vacanciesRes] = await Promise.all([
            fetch("http://localhost:3000/api/parties"),
            fetch("http://localhost:3000/api/player-vacancies"),
          ]);

          if (!partiesRes.ok || !vacanciesRes.ok) {
            throw new Error("Помилка при завантаженні даних");
          }

          const [partiesData, vacanciesData] = await Promise.all([
            partiesRes.json(),
            vacanciesRes.json(),
          ]);

          setGames(Array.isArray(partiesData) ? partiesData : []);
          setVacancies(
            Array.isArray(vacanciesData)
              ? vacanciesData.filter((v) => v.creator === parsedUser.id)
              : []
          );
        }
      } catch (error) {
        console.error("Помилка:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredGames = games.filter((game) => {
    const masters = Array.isArray(game?.masters) ? game.masters : [];
    const players = Array.isArray(game?.players) ? game.players : [];

    return (
      user?.id &&
      (masters.includes(user.id) || players.includes(user.id)) &&
      game.title?.toLowerCase().includes(search.toLowerCase())
    );
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

        <h2 className="page-subtitle">МОЇ ОГОЛОШЕННЯ ЯК ГРАВЕЦЬ</h2>

        <div className="vacancy-list">
          {vacancies.length > 0 ? (
            vacancies.map((vacancy) => (
              <div key={vacancy._id} className="vacancy-card">
                <h3>{vacancy.title || "Оголошення"}</h3>
                <p><b>Система:</b> {vacancy.gameSystem || "Не вказано"}</p>
                <p><b>Дні:</b> {vacancy.days?.join(", ") || "Не вказано"}</p>
                <p>{vacancy.description || "Опис відсутній"}</p>
              </div>
            ))
          ) : (
            <p className="no-games">У вас немає активних оголошень.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGamesPage;
