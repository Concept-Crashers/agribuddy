const mongoose = require('mongoose');

const diseaseAlertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    region: {
        type: String,
        required: true,
    },
    cropAffected: {
        type: String,
        required: true,
    },
    symptoms: [String],
    prevention: [String],
    dateIssued: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
    }
});

module.exports = mongoose.model('DiseaseAlert', diseaseAlertSchema);
