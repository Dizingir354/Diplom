import React, { useState } from "react";

const VerifyPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      alert(data.message);
    } catch (error) {
      console.error("Ошибка:", error);
      alert(`Ошибка: ${error.message}`);
    }
  };

  return (
    <div className="verify-body">
      <div className="verify-box">
        <h1>ПІДТВЕРДЖЕННЯ ПОШТИ</h1>
        <p>Ми надіслали код підтвердження на вашу електронну пошту. Введіть його нижче, щоб продовжити.</p>
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
