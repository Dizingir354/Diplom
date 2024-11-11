document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chat-window");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
    const chatMessages = document.getElementById("chat-messages");

    // Устанавливаем соединение с WebSocket
    const socket = new WebSocket("ws://localhost:3000");

    // Обработка входящих сообщений
    socket.addEventListener("message", (event) => {
        const { username, message } = JSON.parse(event.data);

        // Создаём элемент для нового сообщения
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message");
        messageElement.textContent = `${username}: ${message}`;
        chatMessages.appendChild(messageElement);

        // Прокручиваем вниз окно сообщений
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Функция отправки сообщения
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Отправляем сообщение на сервер
            const username = "ВашеИмя"; // Замените на текущее имя пользователя
            socket.send(JSON.stringify({ username, message }));
            chatInput.value = "";
        }
    }

    // Обработчик на кнопку отправки
    sendButton.addEventListener("click", sendMessage);

    // Обработка Enter для отправки сообщения
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
