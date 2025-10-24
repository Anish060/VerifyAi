const db = require('../config/database.js');
const getAllCredentials = async () => {
    try {
        // mysql2/promise returns [rows, fields] array
        const [rows] = await db.query("SELECT * FROM users");
        return rows;
    } catch (err) {
        console.error('Database error in getAllCredentials:', err);
        throw err; // Re-throw for the controller to handle
    }
};
const getUserByUsername = async (username) => {
    try {
        const [rows] = await db.query(
            "SELECT user_id, username, passwordd FROM users WHERE username = ?",
            [username]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Database error in getUserByUsername:', err);
        throw err;
    }
};

module.exports = {
    getAllCredentials,
    getUserByUsername
};
