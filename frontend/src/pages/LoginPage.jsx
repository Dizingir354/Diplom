import React, { useState, useEffect } from "react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/login.css");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Ошибка входа");
      }
  
      // Сохраняем токен и данные пользователя
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ email: data.email, username: data.username }));
  
      window.location.href = "/profile";
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-bg">
        <img src="/image/login/background.png" alt="Background" />
      </div>
      <div className="login-form">
        <h1>ВХІД</h1>
        <p>
          Dice Roll – найповніше рішення для цифрової гри.
        </p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Пошта</label>
          <input type="email" id="email" name="email" placeholder="Ваш email" required value={formData.email} onChange={handleChange} />

          <label htmlFor="password">Пароль</label>
          <input type="password" id="password" name="password" placeholder="Ваш пароль" required value={formData.password} onChange={handleChange} />

          <div className="button-container">
            <button type="submit" className="button red">ВХІД</button>
            <a href="/register" className="button black">РЕЄСТРАЦІЯ</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
