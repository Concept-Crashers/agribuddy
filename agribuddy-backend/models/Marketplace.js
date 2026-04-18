const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['seeds', 'crop_protection', 'crop_nutrition', 'equipment', 'animal_husbandry', 'organic', 'services'],
        required: true,
    },
    // Sub-category for deeper navigation (e.g. 'Insecticides' under 'crop_protection')
    subcategory: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 }, // UGX
    // Original/crossed-out price for showing "XX% OFF" discount badge
    originalPrice: { type: Number, min: 0 },
    unit: { type: String, default: 'kg' }, // kg, litre, piece, bag, etc.
    stock: { type: Number, default: 0, min: 0 },
    brand: { type: String, trim: true }, // e.g. "Bayer", "Syngenta", local vendors
    seller: {
        name: { type: String, required: true },
        phone: String,
        location: String,
        region: String,
    },
    imageUrl: String,
    tags: [String],
    // Contextual filters — what crops/pests this product targets
    targetCrops: [{ type: String }],   // e.g. ['Maize', 'Coffee', 'Tomato']
    targetPests: [{ type: String }],   // e.g. ['Fall Armyworm', 'Aphids', 'Root Rot']
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

ProductSchema.pre('save', function (next) { this.updatedAt = Date.now(); next(); });
ProductSchema.index({ name: 'text', description: 'text', category: 1, subcategory: 1 });
ProductSchema.index({ targetCrops: 1 });
ProductSchema.index({ targetPests: 1 });

const OrderSchema = new mongoose.Schema({
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    deliveryAddress: {
        village: String,
        subCounty: String,
        district: String,
        region: String,
    },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: String,
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        total: Number,
        _id: false,
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: { type: String, enum: ['cash', 'mobile_money', 'bank'], default: 'mobile_money' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

OrderSchema.pre('save', function (next) { this.updatedAt = Date.now(); next(); });

const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = { Product, Order };
