const marketPriceService = require('../services/marketPriceService');

exports.getLatestPrices = async (req, res) => {
    try {
        const filters = {};
        if (req.query.crop) filters.cropName = new RegExp(req.query.crop, 'i');
        if (req.query.location) filters.location = new RegExp(req.query.location, 'i');
        if (req.query.source) filters.source = req.query.source;

        const prices = await marketPriceService.getLatestPrices(filters);
        res.json({
            success: true,
            count: prices.length,
            data: prices
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.syncPrices = async (req, res) => {
    try {
        await marketPriceService.syncAllPrices();
        res.json({ success: true, message: 'Market prices synchronized successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
