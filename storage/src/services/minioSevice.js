const minioClient = require('../config/minioConfig');

const bucketName = 'mybucket';

const uploadFile = async (objectName, filePath) => {
  try {
    await minioClient.fPutObject(bucketName, objectName, filePath);
    console.log('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const getFile = async (objectName) => {
  try {
    const stream = await minioClient.getObject(bucketName, objectName);
    return stream;
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  getFile
};
