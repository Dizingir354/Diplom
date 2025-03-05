import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/VerifyPage";
import ProfilePage from "./pages/ProfilePage"; // Добавили импорт

const isAuthenticated = () => !!localStorage.getItem("token");

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/profile" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/profile" /> : <RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/profile" element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/login" />} /> {/* Защищённая страница */}
      </Routes>
    </Router>
  );
};

export default App;
