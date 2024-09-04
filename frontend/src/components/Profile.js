import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    return (
        <div>
            <h1>Welcome to Your Profile</h1>
            <div>
                <Link to="/register">
                    <button>Register</button>
                </Link>
                <Link to="/login">
                    <button>Login</button>
                </Link>
            </div>
        </div>
    );
};

export default Profile;
