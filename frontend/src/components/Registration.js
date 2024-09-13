import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const sendVerificationCode = async () => {
        try {
            setIsSendingCode(true);
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
        } finally {
            setIsSendingCode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            alert('Пароль должен содержать не менее 6 символов.');
            return;
        }
        try {
            setIsRegistering(true);
            const response = await axios.post('/api/register', { name, email, password, code: verificationCode });
            if (response.data.success) {
                alert('Регистрация успешна!');
            } else {
                alert('Ошибка регистрации.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка.');
        } finally {
            setIsRegistering(false);
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
                    <button type="button" onClick={sendVerificationCode} disabled={isSendingCode || codeSent}>
                        {isSendingCode ? 'Отправка...' : 'Отправить код подтверждения'}
                    </button>
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
                <button type="submit" disabled={isRegistering}>
                    {isRegistering ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>
        </div>
    );
};

export default Register;
