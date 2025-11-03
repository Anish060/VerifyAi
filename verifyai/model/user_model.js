// userModel.js (PostgreSQL Version - CommonJS)

// Import PostgreSQL connection pool
const db = require('../config/database.js'); 
const { keysToCamelCase } = require('../utility/formatter.js');

/**
 * Inserts a new verification record into the database.
 * @param {object} data - Object containing all record fields (userId, fileName, etc.).
 */
const addData = async (data) => {
  const sql = `
    INSERT INTO verificationrecords (
      user_id, 
      file_name, 
      upload_date, 
      status, 
      ai_score, 
      human_score, 
      deepfake_score, 
      summary,
      detailedExplanation,
      metadataScore,
      linguisticScore,
      pixelInconsistencyScore,
      sourceTokens
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *;
  `;

  const values = [
    data.user_id, 
    data.file_name, 
    data.upload_date, 
    data.status, 
    data.ai_score,
    data.human_score,
    data.deepfake_score,
    data.summary,
    data.detailedExplanation,
    data.metadataScore,
    data.linguisticScore,
    data.pixelInconsistencyScore,
    data.sourceTokens
  ];

  const result = await db.query(sql, values);
  return result.rows[0]; // Return inserted record
};

/**
 * Retrieves all verification records from the database.
 */
const getAllData = async () => {
  try {
    const result = await db.query("SELECT * FROM verificationrecords;");
    return result.rows;
  } catch (err) {
    console.error('Database error in getAllData:', err);
    throw err;
  }
};

/**
 * Retrieves verification records associated with a specific user ID.
 * @param {number} userId - The ID of the user whose records to fetch.
 */
const getDataById = async (userId) => {
  try {
    const result = await db.query(
      "SELECT * FROM verificationrecords WHERE user_id = $1;",
      [userId]
    );

    if (result.rows.length === 0) {
      return []; // Return empty array if no records found
    }

    return keysToCamelCase(result.rows);
  } catch (err) {
    console.error(`Database error in getDataById(${userId}):`, err);
    throw err;
  }
};

// Export functions
module.exports = {
  addData,
  getAllData,
  getDataById
};
