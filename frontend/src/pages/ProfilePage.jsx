import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", username: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Если нет токена, редирект на логин
      return;
    }

    // Заглушка: загружаем данные из localStorage (если они там есть)
    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser({
      email: savedUser.email || "example@email.com",
      username: savedUser.username || "Гість",
    });
  }, [navigate]);

  return (
    <div className="profile-container">
      <h1>👤 Профіль</h1>
      <p><strong>Ім'я:</strong> {user.username}</p>
      <p><strong>Пошта:</strong> {user.email}</p>
      <button onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");  // Перенаправление на главную страницу
      }} className="button red">
        Вийти
      </button>
    </div>
  );
};

export default ProfilePage;
