import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Добавляем боковое меню

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", username: "" });

  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/profile.css");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser({
      email: savedUser.email || "example@email.com",
      username: savedUser.username || "Гість",
    });
  }, [navigate]);

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        <h1>👤 Профіль</h1>
        <p><strong>Ім'я:</strong> {user.username}</p>
        <p><strong>Пошта:</strong> {user.email}</p>
        <button onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }} className="button red">
          Вийти
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
