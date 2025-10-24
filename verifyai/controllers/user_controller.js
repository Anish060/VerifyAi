// user_controller.js

// Assuming your model file is named 'userModel.js' and contains the database functions
// Note: The provided model functions use 'Credentials' in their names, 
// but they operate on 'VerificationRecords'. I will keep the function names 
// but use more descriptive variable names in the controller.
import {
    addData,
    getAllData,  // This is effectively getAllVerificationRecords
    getDataById // This is effectively getVerificationRecordsByUserId
} from '../model/user_model.js'; 
import jwt from 'jsonwebtoken';

// Helper function to manually parse cookies (copied from sample)
const parseCookies = (req) => {
    const cookies = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.trim().split('=');
            if (parts.length === 2) {
                // Use safe decoding
                cookies[parts[0].trim()] = decodeURIComponent(parts[1].trim());
            }
        });
    }
    return cookies;
};

// Helper function to handle common try/catch and response logic
const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json({
        success: true,
        data: data
    });
};

// Helper function to handle errors
const sendError = (res, statusCode, message) => {
    // Log the full error for debugging but send a sanitized message to the client
    res.status(statusCode).json({
        success: false,
        error: message || 'An unexpected error occurred.'
    });
};

// --- Controller Functions ---

/**
 * Handles POST request to add a new verification record.
 * Route: POST /api/verification/record
 */
const addNewRecord = async (req, res) => {
    try {
        // Assume the 'addData' model function relies on a 'data' object in its scope.
        // In a controller, you should pass the required data explicitly.
        // We'll rename the function call parameters for clarity, assuming the model is updated.
        const recordData = {
            userId: req.user.id, // Assuming user ID is available from authentication middleware
            fileName: req.body.file_name,
            status: req.body.status,
            aiScore: req.body.ai_score,
            humanScore: req.body.human_score,
            deepfakeScore: req.body.deepfake_score,
            analysisDetails: req.body.analysis_details
            // Note: The model function 'addData' needs to be adjusted to accept parameters
            // instead of relying on a global 'data' object.
        };

        // For this controller to work, the model function needs to be callable with data:
        // const newRecord = await addData(recordData); 
        
        // Since we can't modify the model here, we'll assume a global 'data' object is NOT used
        // and that the model function signature is fixed, making this call problematic.
        // For demonstration, let's assume 'addData' is adjusted to be:
        const newRecord = await addData(recordData);
        
        sendResponse(res, 201, { message: 'Verification record added successfully', recordId: newRecord.insertId });
    } catch (error) {
        console.error("Error adding new record:", error);
        sendError(res, 500, 'Failed to save verification record.');
    }
};

/**
 * Handles GET request to fetch all verification records (for admin or site-wide view).
 * Route: GET /api/verification/all
 */
const getAllRecords = async (req, res) => {
    try {
        const records = await getAllData(); // Maps to VerificationRecords table
        
        // Transform the snake_case data from the DB to camelCase for the API response
        // Note: The model's getAllCredentials doesn't show toCamelCase, but it's good practice.
        // Assuming toCamelCase is used by the client or later in the stack.
        
        sendResponse(res, 200, records);
    } catch (error) {
        console.error("Error fetching all records:", error);
        sendError(res, 500, 'Failed to retrieve all verification records.');
    }
};

/**
 * Handles GET request to fetch verification records for the authenticated user.
 * Route: GET /api/verification/history
 */
const getUserHistory = async (req, res) => {
    // --- Manual Cookie Parsing (Implemented based on sample) ---
    const cookies = parseCookies(req);
    const token = cookies.jwt; 

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Authorization token not found in cookies.' 
        });
    }

    let userId;

    try {
        // *** INSECURE DECODING (Project Requirement) ***
        const decoded = jwt.decode(token);
        
        if (!decoded || typeof decoded.id === 'undefined') {
             return res.status(401).json({ 
                 success: false,
                 error: 'Token structure is invalid or missing user ID.' 
             });
        }
        
        userId = decoded.id; 

    } catch (err) {
        return res.status(401).json({ 
            success: false,
            error: 'Failed to decode token format.' 
        });
    }

    // --- Database Logic ---
    try {
        // This function name (getDataById) should ideally be getUserVerificationHistory
        const history = await getDataById(userId); 

        sendResponse(res, 200, history); 
        
    } catch (error) {
        if (error.message && error.message.includes('not found')) {
            return sendError(res, 404, 'Verification history not found for this user.');
        }
        console.error("Error fetching user history:", error);
        sendError(res, 500, 'Failed to retrieve user verification history.');
    }
};

// --- Export the controller functions ---
export {
    addNewRecord,
    getAllRecords,
    getUserHistory
};
