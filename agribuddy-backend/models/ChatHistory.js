const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, { _id: false });

const ChatHistorySchema = new mongoose.Schema({
    sessionId: { type: String, required: true, index: true },
    farmerId: { type: String, default: 'anonymous' },
    messages: [MessageSchema],
    cropContext: String, // crop being discussed
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

ChatHistorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
