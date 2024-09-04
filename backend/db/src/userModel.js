const pool = require('./app');

const createUser = async (user) => {
  const { email, password, isActive, activationToken } = user;
  const result = await pool.query(
    'INSERT INTO users (email, password, is_active, activation_token) VALUES ($1, $2, $3, $4) RETURNING *',
    [email, password, isActive, activationToken]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserByToken = async (token) => {
  const result = await pool.query('SELECT * FROM users WHERE activation_token = $1', [token]);
  return result.rows[0];
};

const activateUser = async (userId) => {
  const result = await pool.query(
    'UPDATE users SET is_active = $1, activation_token = $2 WHERE id = $3 RETURNING *',
    [true, null, userId]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByToken,
  activateUser,
};
