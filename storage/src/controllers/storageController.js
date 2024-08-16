const path = require('path');
const minioService = require('../services/minioService');

exports.uploadFile = async (req, res) => {
  try {
    const { fileName } = req.body;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
    await minioService.uploadFile(fileName, filePath);
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: `Failed to upload file: ${error.message}` });
  }
};

exports.getFile = async (req, res) => {
  try {
    const { name } = req.params;
    const stream = await minioService.getFile(name);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: `Failed to get file: ${error.message}` });
  }
};
