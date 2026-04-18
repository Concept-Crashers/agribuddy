const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: { name: String, role: { type: String, enum: ['farmer', 'expert', 'ngo'], default: 'farmer' } },
    content: { type: String, required: true },
    isExpertAnswer: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: {
        name: { type: String, required: true },
        role: { type: String, enum: ['farmer', 'expert', 'ngo'], default: 'farmer' },
        region: String,
    },
    category: {
        type: String,
        enum: ['disease', 'soil', 'weather', 'market', 'general', 'success_story'],
        default: 'general',
    },
    tags: [String],
    imageUrls: [String],
    comments: [CommentSchema],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    isResolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

PostSchema.pre('save', function (next) { this.updatedAt = Date.now(); next(); });
PostSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', PostSchema);
