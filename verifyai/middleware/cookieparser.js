// cookieParserMiddleware.js

/**
 * Middleware function to manually parse the 'Cookie' header and populate req.cookies.
 * This is a custom replacement for the 'cookie-parser' package.
 */
const cookieParserMiddleware = (req, res, next) => {
    // Initialize req.cookies object if it doesn't exist
    req.cookies = {};

    const cookieHeader = req.headers.cookie;

    if (cookieHeader) {
        // Split the header string into individual key=value pairs
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.trim().split('=');
            
            // Ensure there are two parts (key and value)
            if (parts.length === 2) {
                const key = parts[0].trim();
                const value = parts[1].trim();
                
                // Decode the cookie value (important for tokens/values that may contain special characters)
                // Note: The value part might contain the entire remaining string if the value itself has '='
                req.cookies[key] = decodeURIComponent(value);
            }
        });
    }

    // Pass control to the next middleware or route handler
    next();
};

// Change this at the end of the file:
// export default cookieParserMiddleware; 

// TO THIS:
module.exports = cookieParserMiddleware;