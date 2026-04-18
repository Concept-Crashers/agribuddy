const express = require('express');
const router = express.Router();
const DiseaseAlert = require('../models/DiseaseAlert');

// GET /api/alerts – list all active alerts
router.get('/', async (req, res) => {
    try {
        const { region, crop } = req.query;
        const query = {};
        if (region) query.region = region;
        if (crop) query.cropAffected = crop;

        // Optional: filter by non-expired alerts
        // query.expiresAt = { $gt: new Date() };

        const alerts = await DiseaseAlert.find(query).sort({ dateIssued: -1 });
        res.json({ success: true, data: alerts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/alerts/:id – single alert detail
router.get('/:id', async (req, res) => {
    try {
        const alert = await DiseaseAlert.findById(req.params.id);
        if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
        res.json({ success: true, data: alert });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/alerts – create an alert (admin only)
router.post('/', async (req, res) => {
    try {
        const alert = new DiseaseAlert(req.body);
        await alert.save();
        res.status(201).json({ success: true, data: alert });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
