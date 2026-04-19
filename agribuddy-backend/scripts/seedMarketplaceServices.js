const mongoose = require('mongoose');
require('dotenv').config();

// Direct schema imports vs require('../models/Marketplace') dynamically
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['seeds', 'crop_protection', 'crop_nutrition', 'equipment', 'animal_husbandry', 'organic', 'services'],
        required: true,
    },
    subcategory: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    unit: { type: String, default: 'kg' },
    stock: { type: Number, default: 0, min: 0 },
    brand: { type: String, trim: true },
    seller: {
        name: { type: String, required: true },
        phone: String,
        location: String,
        region: String,
    },
    imageUrl: String,
    tags: [String],
    targetCrops: [{ type: String }],
    targetPests: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleServices = [
    {
        name: 'John Deere 5050 E Tractor Hire',
        description: 'Tractor leasing for plowing and land preparation. Fuel is included. Operator is included upon request.',
        category: 'services',
        subcategory: 'Equipment Leasing',
        price: 150000,
        originalPrice: 180000,
        unit: 'Acre',
        brand: 'Rent-A-Tractor UG',
        stock: 5,
        rating: 4.8,
        reviewCount: 42,
        seller: {
            name: 'Kiggundu Farm Equipment',
            phone: '0700000001',
            location: 'Mityana',
            region: 'Central'
        },
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2069&auto=format&fit=crop'
    },
    {
        name: 'Dr. Lwanga - Senior Vet Consultant',
        description: 'Expert veterinary consultation for poultry, cattle, and goats. Available for on-site farm visits.',
        category: 'services',
        subcategory: 'Extension Services',
        price: 100000,
        unit: 'Visit',
        brand: 'Lwanga Vet Services',
        stock: 100,
        rating: 4.9,
        reviewCount: 156,
        seller: {
            name: 'Dr. Lwanga',
            phone: '0770000002',
            location: 'Mukono',
            region: 'Central'
        },
        imageUrl: 'https://images.unsplash.com/photo-1596733430284-f743728fc1e4?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: '10 Acres Prime Farm Land Lease',
        description: 'Fertile loamy soil perfect for maize or beans. Lease is valid for one full planting season. Access to river irrigation.',
        category: 'services',
        subcategory: 'Land Leasing',
        price: 450000,
        unit: 'Season/Acre',
        brand: 'Buganda Land Board',
        stock: 10,
        rating: 4.5,
        reviewCount: 12,
        targetCrops: ['Maize', 'Beans', 'Cassava'],
        seller: {
            name: 'Mr. Kato Ronald',
            phone: '0780000003',
            location: 'Luweero',
            region: 'Central'
        },
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'
    },
    {
        name: 'Bugema Maize Milling & Packaging',
        description: 'Professional maize hulling, milling, and 50kg packaging. Turn your raw maize into premium grade 1 posho.',
        category: 'services',
        subcategory: 'Processing Services',
        price: 300,
        unit: 'Kg',
        brand: 'Bugema Mills',
        stock: 5000,
        rating: 4.7,
        reviewCount: 310,
        targetCrops: ['Maize'],
        seller: {
            name: 'Bugema Processing Plant',
            phone: '0750000004',
            location: 'Bombo',
            region: 'Central'
        },
        imageUrl: 'https://images.unsplash.com/photo-1587825000279-7f3747eb4862?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: 'Cold Chain Delivery Truck (3 Ton)',
        description: 'Refrigerated truck for transporting perishable goods like tomatoes and matooke from farm straight to Kampala markets.',
        category: 'services',
        subcategory: 'Transport & Logistics',
        price: 350000,
        originalPrice: 400000,
        unit: 'Trip',
        brand: 'FreshTrans Ltd',
        stock: 3,
        rating: 4.6,
        reviewCount: 89,
        targetCrops: ['Tomato', 'Banana (Matooke)', 'Onion'],
        seller: {
            name: 'FreshTrans Logistics',
            phone: '0790000005',
            location: 'Kampala',
            region: 'Central'
        },
        imageUrl: 'https://images.unsplash.com/photo-1590496794008-383c8070b257?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: 'AIC Crop Revenue Insurance',
        description: 'Protect your harvest against droughts, floods, and pests. Comprehensive coverage for seasonal food crops.',
        category: 'services',
        subcategory: 'Financial & Insurance',
        price: 80000,
        unit: 'Season/Acre',
        brand: 'Agro Insurance Consortium',
        stock: 1000,
        rating: 4.8,
        reviewCount: 1024,
        seller: {
            name: 'AIC Uganda',
            phone: '0800100200',
            location: 'Kampala',
            region: 'National'
        },
        imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop'
    }
];

const seedServices = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // Delete existing services to prevent duplicates just in case
        await Product.deleteMany({ category: 'services' });
        console.log('Cleared existing service listings.');

        // Insert new services
        await Product.insertMany(sampleServices);
        console.log(`Successfully seeded ${sampleServices.length} agricultural services!`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding services:', error);
        process.exit(1);
    }
};

seedServices();
