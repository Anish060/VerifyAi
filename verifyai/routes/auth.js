const express = require('express');
const router = express.Router();
// Import the handleLogin function from the controller file
const { handleLogin } = require('../controllers/auth.js');


router.post('/login', handleLogin);

module.exports = router;
