class User {
    constructor(username, password, email, isVerified = false, verificationCode = null) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.isVerified = isVerified;        // Статус подтверждения почты (по умолчанию false)
        this.verificationCode = verificationCode;  // Код для подтверждения email (по умолчанию null)
    }

    // Метод для обновления статуса подтверждения
    verifyEmail() {
        this.isVerified = true;
        this.verificationCode = null;  // Код можно удалить после успешной верификации
    }
}

module.exports = User;
