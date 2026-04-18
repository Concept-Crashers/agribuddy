const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET /api/community  – list all posts (newest first)
router.get('/', async (req, res) => {
    try {
        const { q, category, page = 1, limit = 20 } = req.query;
        const query = {};
        if (q) query.$text = { $search: q };
        if (category) query.category = category;

        const posts = await Post.find(query)
            .select('title author category tags views likes isResolved createdAt comments')
            .sort({ createdAt: -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const total = await Post.countDocuments(query);
        res.json({ success: true, data: posts, total });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/community/:id – single post with comments
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
        res.json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/community  – create a post
router.post('/', async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// POST /api/community/:id/comments  – add a comment
router.post('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

        post.comments.push(req.body);
        if (req.body.isExpertAnswer) post.isResolved = true;
        await post.save();

        res.status(201).json({ success: true, data: post.comments[post.comments.length - 1] });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PUT /api/community/:id/like  – like a post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.json({ success: true, likes: post.likes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
