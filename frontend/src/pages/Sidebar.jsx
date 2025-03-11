import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/sidebar.css");
  }, []);

  return (
    <div className="sidebar">
      {/* Лого — кнопка на главную страницу */}
      <Link to="/" className="sidebar-logo">
        <img src="/image/menu/logo.png" alt="Logo" />
      </Link>

      {/* Кнопка перехода на страницу списка игр */}
      <Link to="/games" className="sidebar-button">
        <img src="/image/menu/category.png" alt="Поиск игр" />
      </Link>

      {/* Заглушка — пока просто кнопка без действий */}
      <button className="sidebar-button">
        <img src="/image/menu/user-octagon.png" alt="Неизвестная кнопка" />
      </button>

      {/* Друзья (заглушка) */}
      <button className="sidebar-button">
        <img src="/image/menu/people.png" alt="Друзья" />
      </button>

      {/* Сообщения (заглушка) */}
      <button className="sidebar-button">
        <img src="/image/menu/messages.png" alt="Сообщения" />
      </button>

      {/* Аватарка — ссылка на профиль */}
      <Link to="/profile" className="sidebar-avatar">
        <img src="/image/menu/avatar.png" alt="Аватар" />
        <span className="online-indicator"></span>
      </Link>
    </div>
  );
};

export default Sidebar;
