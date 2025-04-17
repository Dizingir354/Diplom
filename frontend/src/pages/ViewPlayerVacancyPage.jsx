import React, { useEffect, useState } from "react";
import Sidebar from "../pages/Sidebar";
import { useParams } from "react-router-dom";

const ViewPlayerVacancyPage = () => {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/viewPlayerVacancy.css");
  }, []);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/player-vacancies/${id}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить данные вакансии');
        }
        const data = await response.json();
        setVacancy(data);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancy();
  }, [id]);

  if (loading) return <div>Завантаження...</div>;
  if (!vacancy) return <div>Не вдалося завантажити вакансію</div>;

  const renderTags = () => {
    const { gameSystem, platform, age, gameType, days } = vacancy;
    const tags = [gameSystem, platform, age, gameType, ...(days || [])];
    return tags.map((tag, index) => (
      <div key={index} className="tag">
        {tag}
      </div>
    ));
  };

  const renderTopics = () => {
    const topics = [];
    const { uncomfortableTopics } = vacancy;

    if (uncomfortableTopics?.discomfort) {
      uncomfortableTopics.discomfort.forEach((topic) =>
        topics.push({ topic, level: "red" })
      );
    }

    if (uncomfortableTopics?.noDetails) {
      uncomfortableTopics.noDetails.forEach((topic) =>
        topics.push({ topic, level: "yellow" })
      );
    }

    if (uncomfortableTopics?.comfortable) {
      uncomfortableTopics.comfortable.forEach((topic) =>
        topics.push({ topic, level: "" })
      );
    }

    return topics.map(({ topic, level }, index) => (
      <div key={index} className={`trigger-tag ${level}`}>
        {topic}
      </div>
    ));
  };

  return (
    <div className="vacancy-page">
      <Sidebar />
      <div className="vacancy-content">
        <div className="left-column">
          <div className="avatar-and-name">
            <div className="avatar-block" />
            <div className="name">
              {vacancy.creator?.username || "Невідомо"}
            </div>
          </div>
          <div className="tags">{renderTags()}</div>
          <button className="invite-btn">Запросити</button>
          <div className="about-me">{vacancy.description}</div>
        </div>

        <div className="right-column">
          <div className="trigger-tags">{renderTopics()}</div>
          <div className="legend">
            <span className="legend-item red">Дискомфортно</span>
            <span className="legend-item yellow">Без подробиць</span>
            <span className="legend-item">Комфортно</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPlayerVacancyPage;