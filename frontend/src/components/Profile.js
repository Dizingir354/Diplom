import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    return (
        <div>
            <h1>Добро пожаловать в ваш профиль</h1>
            <div>
                <Link to="/register">
                    <button>Регистрация</button>
                </Link>
                <Link to="/login">
                    <button>Войти</button>
                </Link>
            </div>
        </div>
    );
};

export default Profile;
