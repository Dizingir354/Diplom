// src/components/Home.js
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function Home() {
    useEffect(() => {
        // Через 1 секунду редиректим на home.html
        setTimeout(() => {
            window.location.href = '/pages/home.html';  // Переход на home.html
        }, 1000);  // Таймаут 1 секунда (можно изменить по желанию)
    }, []);

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>You will be redirected to the static home.html shortly...</p>
        </div>
    );
}

export default Home;
