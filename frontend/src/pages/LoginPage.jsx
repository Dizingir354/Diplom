import React, { useEffect } from "react";

const LoginPage = () => {
  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/login.css");
  }, []);

  return (
    <div className="login-container">
      <div className="login-bg">
        <img src="/image/login/background.png" alt="Background" />
      </div>
      <div className="login-form">
        <h1>ВХІД</h1>
        <p>
          Dice Roll – найповніше рішення для цифрової гри. Отримайте доступ до
          оголошень, ігрових кімнат, книг правил, гральних кісток та багато
          іншого.
        </p>
        <form id="loginForm">
          <label htmlFor="email">Пошта</label>
          <input type="email" id="email" name="email" placeholder="Ваш email" required />

          <label htmlFor="password">Пароль</label>
          <input type="password" id="password" name="password" placeholder="Ваш пароль" required />

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
