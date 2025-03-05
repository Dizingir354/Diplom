import React, { useEffect, useState } from "react";

const RegisterPage = () => {
  // Состояния для формы
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  // Обновление стилей страницы
  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/register.css");
  }, []);

  // Обработчик изменений в полях формы
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Ошибка регистрации");
      }

      // Сохраняем email в localStorage после успешной регистрации
      localStorage.setItem("email", formData.email);

      alert(data.message);
      window.location.href = "/verify";
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-bg">
        <img src="/image/register/background.png" alt="Background" />
      </div>
      <div className="register-form">
        <h1>РЕЄСТРАЦІЯ</h1>
        <p>
          Dice Roll – найповніше рішення для цифрової гри. Отримайте доступ до оголошень,
          ігрових кімнат, книг правил, гральних кісток та багато іншого.
        </p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Ім'я</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Ваше ім'я" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="email">Пошта</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Ваш email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="password">Пароль</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Ваш пароль" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="confirmPassword">Підтвердити пароль</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            placeholder="Повторіть пароль" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
          />

          <div className="button-container">
            <button type="submit" className="button red">РЕЄСТРАЦІЯ</button>
            <button type="button" className="button black" onClick={() => window.location.href = "/login"}>
              ВХІД
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
