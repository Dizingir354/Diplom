const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  const userId = req.userId;

  try {
    const notifications = await Notification.find({ user: userId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения уведомлений' });
  }
};