/**
 * Seed marketplace products for AgriBuddy Uganda demo.
 * Run: node agribuddy-backend/seeds/seedMarketplace.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { Product } = require('../models/Marketplace');

const PRODUCTS = [
    {
        name: 'Hybrid Maize Seed – LONGE 10H',
        description: 'High-yielding drought-tolerant hybrid maize certified by NAADS Uganda.',
        category: 'seeds', price: 35000, unit: 'kg', stock: 200,
        seller: { name: 'Uganda Seeds Ltd', phone: '0772100200', location: 'Kampala, Industrial Area', region: 'Central' },
        rating: 4.6, reviewCount: 87,
    },
    {
        name: 'NARO Bean Seed – NABE 4',
        description: 'Improved climbing bean variety resistant to angular leaf spot and bean common mosaic virus.',
        category: 'seeds', price: 8000, unit: 'kg', stock: 150,
        seller: { name: 'AGRA Seeds Uganda', phone: '0752300400', location: 'Mbale', region: 'Eastern' },
        rating: 4.4, reviewCount: 52,
    },
    {
        name: 'DAP Fertiliser (50 kg)',
        description: 'Di-Ammonium Phosphate with 18% N and 46% P₂O₅ for basal planting application.',
        category: 'fertilisers', price: 180000, unit: 'bag', stock: 80,
        seller: { name: 'Balton Uganda', phone: '0312200300', location: 'Kampala', region: 'Central' },
        rating: 4.7, reviewCount: 134,
    },
    {
        name: 'Urea (46% N) – 50 kg bag',
        description: 'Straight nitrogen fertiliser ideal for top dressing cereal crops.',
        category: 'fertilisers', price: 165000, unit: 'bag', stock: 120,
        seller: { name: 'Yara Uganda', phone: '0414600800', location: 'Kampala', region: 'Central' },
        rating: 4.5, reviewCount: 99,
    },
    {
        name: 'Mancozeb Fungicide (1 kg)',
        description: 'Broad-spectrum protective fungicide effective against black sigatoka in banana and blight in potatoes.',
        category: 'pesticides', price: 22000, unit: 'kg', stock: 300,
        seller: { name: 'Dudutech Uganda', phone: '0772800100', location: 'Entebbe', region: 'Central' },
        rating: 4.3, reviewCount: 64,
    },
    {
        name: 'Lambda Cyhalothrin Insecticide (500 ml)',
        description: 'Systemic insecticide for control of army worm, bollworm, and pod borers in cereals and legumes.',
        category: 'pesticides', price: 18000, unit: 'piece', stock: 200,
        seller: { name: 'Twiga Chemicals', phone: '0312701200', location: 'Lira', region: 'Northern' },
        rating: 4.1, reviewCount: 41,
    },
    {
        name: 'Hand Hoe (Jembe) – Heavy Duty',
        description: 'Forged steel blade with hardwood handle. Essential for digging, weeding, and planting.',
        category: 'tools', price: 15000, unit: 'piece', stock: 500,
        seller: { name: 'Mukwano Industries', phone: '0414333600', location: 'Kampala', region: 'Central' },
        rating: 4.8, reviewCount: 210,
    },
    {
        name: 'Knapsack Sprayer – 16 L',
        description: 'Manual compression sprayer for applying pesticides and foliar fertilisers. Comes with 3 nozzle tips.',
        category: 'tools', price: 85000, unit: 'piece', stock: 60,
        seller: { name: 'AgroUganda Equipment', phone: '0702500900', location: 'Jinja', region: 'Eastern' },
        rating: 4.2, reviewCount: 37,
    },
    {
        name: 'Dairy Cattle Feed – Novatek (50 kg)',
        description: 'Balanced dairy meal with 16% protein for lactating Holstein/Friesian cows. Boosts milk production.',
        category: 'feeds', price: 145000, unit: 'bag', stock: 70,
        seller: { name: 'Kampala Pharmaceutical Industries', phone: '0414253456', location: 'Kampala', region: 'Central' },
        rating: 4.6, reviewCount: 58,
    },
    {
        name: 'Layers Mash (50 kg)',
        description: 'Complete feed for laying hens. 17% crude protein, balanced minerals, and vitamins for optimal egg production.',
        category: 'feeds', price: 130000, unit: 'bag', stock: 90,
        seller: { name: 'Ugachick Poultry Breeders', phone: '0414574818', location: 'Kampala', region: 'Central' },
        rating: 4.5, reviewCount: 73,
    },
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agribuddy');
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared products collection');

    const result = await Product.insertMany(PRODUCTS);
    console.log(`✅ Seeded ${result.length} marketplace products`);

    await mongoose.disconnect();
    console.log('Done');
}

seed().catch(err => { console.error(err); process.exit(1); });
