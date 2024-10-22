const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

// Проверка существования бакета и его создание при необходимости
minioClient.bucketExists('uploads', (err, exists) => {
    if (err || !exists) {
        minioClient.makeBucket('uploads', 'us-east-1', (err) => {
            if (err) {
                console.error('Ошибка при создании бакета:', err);
            } else {
                console.log('Бакет успешно создан.');
            }
        });
    }
});

module.exports = minioClient;
