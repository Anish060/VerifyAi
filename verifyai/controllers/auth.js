const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Assuming you use bcrypt to hash passwords
const { getUserByUsername } = require('../model/credentials'); // Import new model function

// --- Helper Functions (For clean response handling) ---
const sendResponse = (res, status, data) => {
    return res.status(status).json({ success: true, ...data });
};

const sendError = (res, status, message) => {
    return res.status(status).json({ success: false, message });
};
// --- End Helper Functions ---

/**
 * Handles user login, verifies credentials, and sets an HTTP-only JWT cookie.
 */
exports.handleLogin = async (req, res) => {
    const { username, password } = req.body;
    const PROJECT_SECRET = 'my_clg_proj_ai_verifier_secret';

    // 1. Input validation
    if (!username || !password) {
        return sendError(res, 400, 'Username and password are required.');
    }

    try {
        // 2. Fetch user from database
        const user = await getUserByUsername(username);

        if (!user) {
            return sendError(res, 401, 'Invalid credentials.');
        }

        // 3. Compare passwords
        // IMPORTANT: Assumes passwords in the DB are hashed using bcrypt
        const isMatch = (password===user.passwordd);

        if (!isMatch) {
            return sendError(res, 401, 'Invalid credentials.');
        }

        // 4. Create and sign JWT
        const token = jwt.sign(
            { id: user.user_id }, // Payload: Store the user_id from the database
            PROJECT_SECRET, // Your secret key (must be in .env)
            { expiresIn: '1d' }
        );

        // 5. Set JWT as an HTTP-Only Cookie
        res.cookie('jwt', token, {
            httpOnly: true,                 // Essential for security
            secure: process.env.NODE_ENV === 'production', // Use 'secure' in production (HTTPS)
            maxAge: 24 * 60 * 60 * 1000,    // 1 day expiration
            sameSite: 'Lax'                 // Good default cross-site setting
        });

        // 6. Send success response and the user ID
        sendResponse(res, 200, { 
            message: 'Login successful', 
            user_id: user.user_id 
        });

    } catch (error) {
        console.error("Login Error:", error);
        sendError(res, 500, 'Internal server error during login.');
    }
};
