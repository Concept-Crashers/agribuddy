const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: ['organic', 'chemical', 'cultural', 'biological'] },
    instructions: String,
    availability: String,
    costEstimate: String,
}, { _id: false });

const DiseaseInfoSchema = new mongoose.Schema({
    name: String,
    symptoms: [String],
    severity: { type: String, enum: ['low', 'medium', 'high'] },
    treatments: [TreatmentSchema],
    preventionTips: [String],
}, { _id: false });

const CropKnowledgeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    localName: String, // Luganda or other local language name
    scientificName: String,
    category: {
        type: String,
        enum: ['grain', 'vegetable', 'fruit', 'cash_crop', 'legume', 'root', 'tuber', 'herb', 'other'],
        required: true,
    },
    description: { type: String, required: true },
    growingConditions: {
        climate: String,
        soilType: String,
        rainfall: String,
        altitude: String,
        temperature: String,
    },
    plantingGuide: {
        season: String,
        spacing: String,
        depth: String,
        germination: String,
        harvestTime: String,
    },
    commonDiseases: [DiseaseInfoSchema],
    nutritionalInfo: String,
    marketValue: String, // avg price in UGX per kg
    regions: [String], // Ugandan regions where commonly grown
    imageUrl: String,
    tips: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

CropKnowledgeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Text search index for semantic search
CropKnowledgeSchema.index({ name: 'text', description: 'text', localName: 'text' });

module.exports = mongoose.model('CropKnowledge', CropKnowledgeSchema);
