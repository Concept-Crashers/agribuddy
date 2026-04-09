const express = require('express');
const router = express.Router();
const ussdMenuController = require('../controllers/ussdMenuController');

// The main entry point for the USSD application
router.post('/', ussdMenuController.handleUssdRequest);

module.exports = router;
