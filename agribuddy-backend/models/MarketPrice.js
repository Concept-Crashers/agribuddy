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
    dateUpdated: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
