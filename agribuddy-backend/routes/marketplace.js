const express = require('express');
const router = express.Router();
const { Product, Order } = require('../models/Marketplace');

// ── Products ────────────────────────────────────
// GET /api/marketplace/products
// Supports: ?q=search&category=seeds&crop=Maize&pest=Aphids&limit=20&page=1
router.get('/products', async (req, res) => {
    try {
        const { q, category, crop, pest, limit = 20, page = 1 } = req.query;
        const query = { isAvailable: true };
        if (q) query.$text = { $search: q };
        if (category) query.category = category;
        // Contextual BigHaat-style filters
        if (crop) query.targetCrops = { $in: [new RegExp(crop, 'i')] };
        if (pest) query.targetPests = { $in: [new RegExp(pest, 'i')] };

        const products = await Product.find(query)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort({ rating: -1, createdAt: -1 });

        const total = await Product.countDocuments(query);
        res.json({ success: true, data: products, total });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/marketplace/products/:id
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/marketplace/products  (seller lists a product)
router.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// ── Orders ──────────────────────────────────────
// POST /api/marketplace/orders  (buyer places an order)
router.post('/orders', async (req, res) => {
    try {
        const { buyerName, buyerPhone, deliveryAddress, items, paymentMethod, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Cart is empty' });
        }

        // Calculate totals
        const populatedItems = items.map(item => ({
            ...item,
            total: item.quantity * item.unitPrice,
        }));
        const totalAmount = populatedItems.reduce((sum, i) => sum + i.total, 0);

        const order = new Order({
            buyerName, buyerPhone, deliveryAddress,
            items: populatedItems,
            totalAmount, paymentMethod, notes,
        });
        await order.save();

        // Decrement stock for each product
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// GET /api/marketplace/orders/:phone  (buyer views their orders)
router.get('/orders/:phone', async (req, res) => {
    try {
        const orders = await Order.find({ buyerPhone: req.params.phone })
            .populate('items.product', 'name imageUrl')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
