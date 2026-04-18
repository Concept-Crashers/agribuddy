const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        default: '',
    },
    isRegistered: {
        type: Boolean,
        default: false,
    },
    languagePreference: {
        type: String,
        enum: ['English', 'Luganda', 'Runyankole', 'Luo'],
        default: 'English',
    },
    location: {
        type: String,
        default: '',
    },
    primaryCrops: [{
        type: String,
    }],
    subscriptions: {
        isActive: { type: Boolean, default: false },
        expiresAt: { type: Date },
        focus: { type: String, default: '' }, // e.g., 'maize', 'poultry'
        duration: { type: String, default: '' } // e.g., '1 Week', '1 Month', '1 Year'
    },
    ussdSessionState: {
        type: Object,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Farmer', farmerSchema);
