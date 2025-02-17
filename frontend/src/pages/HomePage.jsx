import React, { useEffect } from "react";

const Header = () => (
  <header className="hero-section" style={{ backgroundImage: "url('/image/home/home1.png')" }}>
    <div className="header-container">
      <div className="logo">
        <img src="/image/home/logo.png" alt="Logo" />
      </div>
      <nav className="auth-links">
        <a href="/login">Вхід</a>
        <a href="/register">Реєстрація</a>
      </nav>
    </div>
    <HeroContent />
  </header>
);

const HeroContent = () => (
  <div className="hero-content">
    <h1>
      ВАШ НАЙКРАЩИЙ ВИБІР ДЛЯ <br />
      <span className="highlight">ЗБОРУ ГРУПИ</span>
    </h1>
    <p>Беріть участь у ігрових сесіях та проведіть незабутні пригоди.</p>
    <a href="/register" className="btn-main">СТВОРИТИ АККАУНТ</a>
  </div>
);

const GamesSection = () => (
  <section className="games-section">
    <div className="games-container">
      <img src="/image/home/dnd-logo.png" alt="Dungeons & Dragons" />
      <img src="/image/home/pathfinder-logo.png" alt="Pathfinder" />
      <img src="/image/home/cthulhu-logo.png" alt="Call of Cthulhu" />
      <img src="/image/home/vampire-logo.png" alt="Vampire: The Masquerade" />
    </div>
  </section>
);

const Feature = ({ title, text, image, reverse }) => (
  <div className={`feature ${reverse ? "reverse" : ""}`}>
    <div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
    <img src={image} alt="Feature Image" />
  </div>
);

const FeaturesSection = () => (
  <section className="features-section">
    <Feature 
      title="НЕ ВАРТО ОЧІКУВАТИ, ПОТРІБНО ДІЯТИ"
      text="Dice Roll - безліч оголошень майстрів та гравців чекають на вас, щоб провести гру або скласти вам кампанію."
      image="/image/home/home2.png"
    />
    <Feature 
      title="БЕЗЛІЧ НОВИХ ЗНАЙОМСТВ"
      text="Dice Roll — безліч оголошень майстрів та гравців чекають на вас, щоб провести гру або скласти вам кампанію."
      image="/image/home/home3.png"
      reverse
    />
    <Feature 
      title="ЗАВЖДИ ЗНАЙТЕ, КОЛИ У ВАС ГРА"
      text="Dice Roll — нагадає вам, коли час до початку гри почне спливати."
      image="/image/home/home4.png"
    />
  </section>
);

const Footer = () => (
  <>
    <footer className="footer">
      <p>ЧОГО Ж ВИ <span className="highlight">ЧЕКАЄТЕ</span>?</p>
      <a href="/register" className="button">СТВОРИТИ АККАУНТ</a>
    </footer>
    <div className="footer-bottom">
      <div className="footer-container">
        <div className="footer-logo">
          <img src="/image/home/logo.png" alt="Logo" />
        </div>
        <div className="footer-text">
          <p>
            Dungeons & Dragons (D&D) is a tabletop role-playing game created in 1974. Players create unique characters and embark on fantastic adventures led by a Dungeon Master. The game combines strategy, imagination, and teamwork to offer a fun experience for all involved.
          </p>
        </div>
        <div className="footer-socials">
          <a href="#"><img src="/image/home/twiter-logo.png" alt="Twitter" /></a>
          <a href="#"><img src="/image/home/facebook-logo.png" alt="Facebook" /></a>
          <a href="#"><img src="/image/home/youtube-logo.png" alt="YouTube" /></a>
        </div>
      </div>
    </div>
  </>
);

const HomePage = () => {
  useEffect(() => {
    document.getElementById("page-style").setAttribute("href", "/css/home.css");
  }, []);

  return (
    <div>
      <Header />
      <GamesSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default HomePage;
