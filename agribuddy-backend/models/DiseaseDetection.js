const mongoose = require('mongoose');

const diseaseDetectionSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true,
    },
    cropType: {
        type: String,
        required: true,
    },
    detectedDisease: {
        type: String,
        required: true,
    },
    aiAdvice: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: '',
    },
    dateDetected: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('DiseaseDetection', diseaseDetectionSchema);
