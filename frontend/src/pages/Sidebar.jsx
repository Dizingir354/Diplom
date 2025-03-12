import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  useEffect(() => {
    // Подключаем стили для сайдбара
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/sidebar.css";
    link.id = "sidebar-style";
    document.head.appendChild(link);

    return () => {
      // Удаляем стиль при размонтировании (если это когда-либо потребуется)
      document.getElementById("sidebar-style")?.remove();
    };
  }, []);

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-logo">
        <img src="/image/menu/logo.png" alt="Logo" />
      </Link>

      <Link to="/games" className="sidebar-button">
        <img src="/image/menu/category.png" alt="Поиск игр" />
      </Link>

      <button className="sidebar-button">
        <img src="/image/menu/user-octagon.png" alt="Неизвестная кнопка" />
      </button>

      <button className="sidebar-button">
        <img src="/image/menu/people.png" alt="Друзья" />
      </button>

      <button className="sidebar-button">
        <img src="/image/menu/messages.png" alt="Сообщения" />
      </button>

      <Link to="/profile" className="sidebar-avatar">
        <img src="/image/menu/avatar.png" alt="Аватар" />
        <span className="online-indicator"></span>
      </Link>
    </div>
  );
};

export default Sidebar;
