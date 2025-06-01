import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // ⚠️ Замінити на актуальний бекенд

const PartyChat = ({ partyId, username, messages: initialMessages }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages || []);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
  socket.emit('joinRoom', { partyId, username });

  socket.on('message', (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  socket.on('chatHistory', (history) => {
    setMessages(history);
  });

  return () => {
    socket.off('message');
    socket.off('chatHistory');
  };
}, [partyId, username]);


  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit('chatMessage', {
      partyId,
      username,
      message,
    });

    setMessage('');
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index}><strong>{msg.username}:</strong> {msg.message}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Повідомлення..."
        />
        <button type="submit">Надіслати</button>
      </form>
    </div>
  );
};

export default PartyChat;
