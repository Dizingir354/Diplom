import React, { useState, useEffect } from "react";

const VerifyPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/verify.css");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Отправка данных для верификации:", { email, code });

    try {
      const response = await fetch("http://localhost:3000/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode: code }),
      });

      const data = await response.json();
      console.log("Ответ сервера:", data);

      if (!response.ok) {
        throw new Error(data.message || "Ошибка верификации");
      }

      // Сохраняем данные так же, как при логине
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.userId,
        email: data.email,
        username: data.username,
      }));

      window.location.href = "/profile";
    } catch (error) {
      console.error("Ошибка:", error);
      setError(error.message);
    }
  };

  return (
    <div className="verify-body">
      <div className="verify-box">
        <h1>ПІДТВЕРДЖЕННЯ ПОШТИ</h1>
        <p>Ми надіслали код підтвердження на вашу електронну пошту. Введіть його нижче, щоб продовжити.</p>
        
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Електронна пошта</label>
          <input
            type="email"
            id="email"
            placeholder="Введіть вашу пошту"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="code">Код підтвердження</label>
          <input
            type="text"
            id="code"
            placeholder="Введіть код"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button type="submit" className="verify-button">ПІДТВЕРДИТИ</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
