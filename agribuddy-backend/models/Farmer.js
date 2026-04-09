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
