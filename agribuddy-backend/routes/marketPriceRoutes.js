const express = require('express');
const router = express.Router();
const marketPriceController = require('../controllers/marketPriceController');

// GET /api/market-prices - Get latest prices with optional filtering
router.get('/', marketPriceController.getLatestPrices);

// POST /api/market-prices/sync - Manually trigger a price sync
router.post('/sync', marketPriceController.syncPrices);

module.exports = router;
