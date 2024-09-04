import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    const sendVerificationCode = async () => {
        try {
            const response = await axios.post('/api/send-code', { email });
            if (response.data.success) {
                setCodeSent(true);
                alert('Код подтверждения отправлен на вашу почту.');
            } else {
                alert('Ошибка при отправке кода.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/register', { name, email, password, code: verificationCode });
            if (response.data.success) {
                alert('Регистрация успешна!');
            } else {
                alert('Ошибка регистрации.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка.');
        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Имя:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Почта:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button type="button" onClick={sendVerificationCode}>Отправить код подтверждения</button>
                </div>
                {codeSent && (
                    <div>
                        <label>Код подтверждения:</label>
                        <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                    </div>
                )}
                <div>
                    <label>Пароль:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;
