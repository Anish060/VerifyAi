const db = require('../config/database.js');

const getAllCredentials = async () => {
  try {
    // pg returns { rows, fields } object — not an array like mysql2
    const result = await db.query('SELECT * FROM users');
    return result.rows; // return all user rows
  } catch (err) {
    console.error('Database error in getAllCredentials:', err);
    throw err;
  }
};

const getUserByUsername = async (username) => {
  try {
    // PostgreSQL uses $1, $2... as parameter placeholders
    const result = await db.query(
      'SELECT user_id, username, passwordd FROM users WHERE username = $1',
      [username]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (err) {
    console.error('Database error in getUserByUsername:', err);
    throw err;
  }
};

module.exports = {
  getAllCredentials,
  getUserByUsername,
};
