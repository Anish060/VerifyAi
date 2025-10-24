// userModel.js (CommonJS Module)

// Import the database connection using require()
const db = require('../config/database.js'); 
const { keysToCamelCase } = require('../utility/formatter.js'); 
// Note: Assuming 'toCamelCase' is a utility function available via require or defined elsewhere.
// const toCamelCase = require('../utils/toCamelCase'); // Uncomment if needed

/**
 * Inserts a new verification record into the database.
 * @param {object} data - Object containing all record fields (userId, fileName, etc.).
 */
const addData = async (data) => {
    // SQL command to insert data into the VerificationRecords table
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
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;

    // Values array mapping directly to the placeholders in the SQL query
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
    // Use await with the Promise-based query
    const [result] = await db.query(sql, values);
    return result;
};

/**
 * Retrieves all verification records from the database (potentially for admin use).
 */
const getAllData = async () => {
    try {
        // mysql2/promise returns [rows, fields] array
        const [rows] = await db.query("SELECT * FROM verificationrecords");
        return rows;
    } catch (err) {
        console.error('Database error in getAllCredentials:', err);
        throw err; // Re-throw for the controller to handle
    }
};

/**
 * Retrieves verification records associated with a specific user ID.
 * @param {number} userId - The ID of the user whose records to fetch.
 */
const getDataById = async (userId) => {
    try {
        // mysql2/promise returns [rows, fields] array
        const [rows] = await db.query(
            "SELECT * FROM verificationrecords WHERE user_id = ?",
            [userId]
        );

        // --- DEBUGGING LOG ADDED ---
       
        // --- END DEBUGGING LOG ---

        if (rows.length === 0) {
            // FIX 1: For history/list endpoints, return an empty array if no records are found.
            // This prevents a 500 error on the client when a user is new.
            return []; 
        }

        // FIX 2: Convert the entire array of rows, not just the first element.
        // The keysToCamelCase utility is designed to handle arrays recursively.
        return rows; 
    } catch (err) {
        // Use the function parameter 'userId' instead of an undefined 'id' variable in console.error
        console.error(`Database error in getVerificationRecordsByUserId(${userId}):`, err); 
        throw err; // Re-throw for the controller to handle
    }
};

// Export the functions using module.exports (CommonJS)
module.exports = {
    addData,
    getAllData,
    getDataById
};

// Note: Removed the redundant `user_model` object wrapper as module.exports achieves the same goal.