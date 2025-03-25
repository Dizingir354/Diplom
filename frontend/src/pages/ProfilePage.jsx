import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", username: "" });
  const [myParties, setMyParties] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/profile.css");

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser({
      email: storedUser.email || "example@email.com",
      username: storedUser.username || "Гість",
    });

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Ошибка: пользователь не авторизован.");
      return;
    }

    const fetchParties = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/parties", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки партий");
        }

        const data = await response.json();
        console.log("Все партии:", data);

        const userId = storedUser.id;
        const filteredParties = data.filter(party => party.masters.includes(userId));

        setMyParties(filteredParties);
      } catch (error) {
        console.error("Ошибка загрузки партий:", error);
        setErrorMessage("Ошибка при загрузке партий.");
      }
    };

    fetchParties();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    navigate("/");
  };
  

  return (
    <div className="profile-page">
      <Sidebar />

      <div className="profile-content">
        {/* Кнопка выхода */}
        <button className="logout-button" onClick={handleLogout}>Вийти</button>

        <div className="profile-header">
          <img className="banner" src="/image/profile/banner.png" alt="Profile banner" />
          <div className="profile-info">
            <img className="avatar" src="/image/profile/avatar.png" alt="User avatar" />
            <div>
              <h2>{user.username}</h2>
              <p>{user.email}</p>
            </div>
          </div>
        </div>

        <div className="announcements">
          <h2>Мої партії</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="announcement-list">
            {myParties.length > 0 ? (
              myParties.map((party) => (
                <div key={party._id} className="announcement-card">
                  <h3 className="party-title">{party.title}</h3>

                  <p className="party-time">
                    <strong>Час:</strong> {party.time}{" "}
                    {party.tags?.days?.length > 0 && `(${party.tags.days.join(", ")})`}
                  </p>

                  {party.tags && Object.values(party.tags).flat().length > 0 && (
                    <p className="party-tags">
                      <strong>Теги:</strong>{" "}
                      {Object.values(party.tags).flat().map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </p>
                  )}

                  {party.requirements && (
                    <p className="party-requirements">
                      <strong>Вимоги:</strong> {Array.isArray(party.requirements) 
                        ? party.requirements.join(", ") 
                        : party.requirements}
                    </p>
                  )}

                  {party.description?.trim() && (
                    <p className="party-description">
                      <strong>опис:</strong> {party.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="no-announcements">У вас поки немає партій.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
