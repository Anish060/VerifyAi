const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verifycontroller');

router.post('/', verifyController.handleDetection);

module.exports = router;
