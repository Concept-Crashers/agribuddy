const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
        default: 'kg',
    },
    location: {
        type: String,
        required: true,
    },
    district: {
        type: String,
    },
    source: {
        type: String,
        required: true,
        default: 'Market',
    },
    trend: {
        type: Number, // Percentage change
        default: 0,
    },
    dateUpdated: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
