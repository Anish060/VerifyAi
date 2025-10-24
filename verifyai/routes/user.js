// verificationRoutes.js (CommonJS Module)

const express = require('express');
const router = express.Router();

// Assuming your controller file is named 'verificationController.js'
// Note: Use require() and get the functions from the module.exports object.
const {
    addNewRecord,
    getUserHistory,
    getAllRecords
    // If you need auth for getAllRecords: auth
} = require('../controllers/user_controller'); 

// If your server needs the phone number functions (addPhoneNumber, getPhoneNumber), 
// you would need to require them from the appropriate controller file.
// const { addPhoneNumber, getPhoneNumber } = require('../controllers/credentialController');


// --- Verification Records Routes ---

// Route to get the entire history for the user. (Assumes cookie middleware is applied globally)
// GET /api/verification/history
router.get('/history', getUserHistory); 

// Route to create a new verification record (e.g., after an upload/scan).
// POST /api/verification/create
router.post('/create', addNewRecord); 

// Optional: Route for admins to see ALL records (Uncomment and add auth if needed)
// router.get('/all', auth, getAllRecords);

// --- The original 'phone' route (if you decide to keep it) ---
/*
router.route('/phone')
    .post(addPhoneNumber) 
    .get(getPhoneNumber);
*/

// Export the router using CommonJS syntax
module.exports = router;