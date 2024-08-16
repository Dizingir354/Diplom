const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const storageRoutes = require('./routes/storageRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api/storage', storageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
