// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    useEffect(() => {
        // Редирект на home.html при монтировании компонента
        window.location.href = "/pages/home.html";
    }, []); // useEffect запускается один раз при монтировании компонента

    return (
        <Router>
            <Routes>
                {/* Если ты попадаешь на корень, редиректим на home.html */}
                <Route path="/" element={<></>} />
            </Routes>
        </Router>
    );
}

export default App;
