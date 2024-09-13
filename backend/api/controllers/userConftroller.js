const User = require('../models/User');

exports.uploadAvatar = async (req, res) => {
  const userId = req.userId; // Предполагается, что ID пользователя доступен после аутентификации
  const avatarPath = req.file.path;

  try {
    await User.findByIdAndUpdate(userId, { avatar: avatarPath });
    res.json({ message: 'Аватарка обновлена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении аватарки' });
  }
};
