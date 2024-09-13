const amqp = require('amqplib');

let channel, connection;

exports.connect = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Подключено к RabbitMQ');
  } catch (error) {
    console.error('Ошибка подключения к RabbitMQ:', error);
  }
};

exports.sendToQueue = async (queueName, data) => {
  try {
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.error('Ошибка отправки в очередь:', error);
  }
};