import React, { useEffect, useState } from 'react';
import Sidebar from '../pages/Sidebar';
import PartyChat from '../pages/PartyChat';
import { useParams } from 'react-router-dom';

const ViewPartyPage = () => {
  const { id } = useParams();
  const [party, setParty] = useState({
    title: '',
    description: '',
    days: [],
    masters: [],
    players: []
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]); // 💬

  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/viewParty.css");

    const savedNotes = localStorage.getItem(`party_notes_${id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUsername(parsedUser.username || '');
      } catch (err) {
        console.error("Ошибка при разборе user из localStorage:", err);
      }
    }

    const fetchParty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/parties/${id}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить данные партии');
        }

        const data = await response.json();

        setParty({
          title: data.title || 'Без названия',
          description: data.description || 'Описание отсутствует',
          days: Array.isArray(data.days) ? data.days : [],
          masters: Array.isArray(data.masters) ? data.masters : [],
          players: Array.isArray(data.players) ? data.players : []
        });
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/parties/${id}/messages`);
        if (!response.ok) throw new Error('Не удалось загрузить сообщения');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Ошибка при загрузке истории сообщений:", err);
      }
    };

    fetchParty();
    fetchMessages();
  }, [id]);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`party_notes_${id}`, newNotes);
  };

  const formatDays = (days) => {
    if (!days || days.length === 0) return 'Дні не вказані';
    return days.join(', ');
  };

  if (loading) return <div className="loading">Завантаження партії...</div>;
  if (error) return <div className="error">Помилка: {error}</div>;

  return (
    <div className="view-party-wrapper">
      <Sidebar />
      <div className="view-party-content">
        <div className="top-banner">
          <div className="banner-title">{party.title}</div>
        </div>

        <div className="content-grid">
          <div className="left-column">
            <div className="block">
              <div className="block-title">Майстер</div>
              {party.masters.length > 0 ? (
                party.masters.map((master, index) => (
                  <div key={`master-${master._id || index}`} className="user-block">
                    <span className="user-name">{master.username || `Майстер ${index + 1}`}</span>
                    <span className={`status ${master.online ? 'online' : 'offline'}`} />
                  </div>
                ))
              ) : (
                <div className="no-users">Немає майстрів</div>
              )}
            </div>

            <div className="block">
              <div className="block-title">Гравці ({party.players.length})</div>
              {party.players.length > 0 ? (
                party.players.map((player, index) => (
                  <div key={`player-${player._id || index}`} className="user-block">
                    <span className="user-name">{player.username || `Гравець ${index + 1}`}</span>
                    <span className={`status ${player.online ? 'online' : 'offline'}`} />
                  </div>
                ))
              ) : (
                <div className="no-users">Поки немає гравців</div>
              )}
            </div>
          </div>

          <div className="center-column">
            <div className="block">
              <PartyChat partyId={id} username={username} messages={messages} />
            </div>
          </div>

          <div className="right-column">
            <div className="block">
              <div className="block-title">Опис</div>
              <div className="desc-text">{party.description}</div>
            </div>

            <div className="block">
              <div className="block-title">Дні проведення партій</div>
              <div className="days-text">{formatDays(party.days)}</div>
            </div>

            <div className="block">
              <div className="block-title">Нотатки</div>
              <ul className="notes-list">
                {notes ? (
                  notes.split('\n').map((line, index) => (
                    <li key={`note-${index}`}>{line}</li>
                  ))
                ) : (
                  <li>Нотаток поки немає</li>
                )}
              </ul>
              <textarea
                placeholder="Введіть свої нотатки..."
                value={notes}
                onChange={handleNotesChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPartyPage;
