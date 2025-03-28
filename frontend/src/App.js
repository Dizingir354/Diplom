import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/VerifyPage";
import ProfilePage from "./pages/ProfilePage";
import GameListPage from "./pages/GameListPage"; 
import CreateGamePage from "./pages/CreateGamePage"; 
import MyGamesPage from "./pages/UserGamesPage";
import PlayerVacanciesPage from "./pages/PlayerVacanciesPage"; // Подключаем страницу списка вакансий игроков
import CreatePlayerVacancyPage from "./pages/CreatePlayerVacancyPage"; // Подключаем страницу создания вакансии

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        
        {/* Страницы игр */}
        <Route path="/games" element={<GameListPage />} />
        <Route path="/games/create" element={isAuthenticated ? <CreateGamePage /> : <Navigate to="/login" />} />

        {/* Страница "Мои Игры" */}
        <Route path="/my-games" element={isAuthenticated ? <MyGamesPage /> : <Navigate to="/login" />} />

        {/* Вакансии игроков */}
        <Route path="/player-vacancies" element={<PlayerVacanciesPage />} />
        <Route path="/player-vacancies/create" element={isAuthenticated ? <CreatePlayerVacancyPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
