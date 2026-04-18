/**
 * Seed community forum posts for AgriBuddy Uganda demo.
 * Run: node agribuddy-backend/seeds/seedCommunity.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Post = require('../models/Post');

const POSTS = [
    {
        title: 'My maize leaves are turning yellow from the bottom – what is happening?',
        content: 'I planted longe 10H maize three weeks ago and the lower leaves are turning yellow while upper ones look fine. Is it nitrogen deficiency or something else? I used DAP at planting but no top dressing yet.',
        author: { name: 'John Okello', role: 'farmer', region: 'Northern' },
        category: 'soil',
        tags: ['maize', 'yellowing', 'nitrogen'],
        views: 128, likes: 14,
        comments: [
            {
                author: { name: 'Dr. Sarah Namukasa', role: 'expert' },
                content: 'Classic nitrogen deficiency John. Lower leaves yellow first because nitrogen is mobile – the plant pulls it to newer growth. Apply urea at 60 kg/ha as a top dressing now and you should see improvement in 10-14 days. Also check spacing; overcrowding worsens this.',
                isExpertAnswer: true, likes: 22,
            },
            {
                author: { name: 'Mary Atim', role: 'farmer' },
                content: 'I had the same problem last season. Top dressing with urea worked well for me. Make sure to apply it after rain or watering.',
                isExpertAnswer: false, likes: 8,
            },
        ],
        isResolved: true,
    },
    {
        title: 'Coffee wilt disease – how do I save my plantation?',
        content: 'I have 500 Robusta coffee trees and about 30 of them are showing sudden wilting even though the soil looks moist. I heard about coffee wilt (Fusarium) but don\'t know what to do. Please help.',
        author: { name: 'Patrick Mugisha', role: 'farmer', region: 'Western' },
        category: 'disease',
        tags: ['coffee', 'wilt', 'fusarium', 'robusta'],
        views: 256, likes: 31,
        comments: [
            {
                author: { name: 'NACRRI Extension Officer', role: 'expert' },
                content: 'Fusarium wilt (CWD) is a serious vascular disease with no chemical cure once a tree is infected. Immediately mark and uproot affected trees, burn them far from the plantation. Do NOT plant coffee in the same holes for at least 3 years. Use CWD-resistant varieties like NARO STABLE for replanting. Contact your nearest NACRRI office for free planting material.',
                isExpertAnswer: true, likes: 45,
            },
        ],
        isResolved: true,
    },
    {
        title: 'Best time to plant rice in Butaleja District?',
        content: 'I want to start rice farming in Butaleja near the wetlands. When is the best planting time and what variety is recommended for lowland irrigation?',
        author: { name: 'Grace Sunday', role: 'farmer', region: 'Eastern' },
        category: 'general',
        tags: ['rice', 'Butaleja', 'planting calendar', 'varieties'],
        views: 89, likes: 11,
        comments: [],
        isResolved: false,
    },
    {
        title: 'Army worm outbreak in Soroti – where can I get lambdacyhalothrin urgently?',
        content: 'There is a massive army worm outbreak across Soroti district. The worms are destroying millet and sorghum fields quickly. Where can I find lambda insecticide and how much do I apply?',
        author: { name: 'Emmanuel Ekon', role: 'farmer', region: 'Eastern' },
        category: 'disease',
        tags: ['army worm', 'millet', 'sorghum', 'Soroti', 'pesticide'],
        views: 344, likes: 28,
        comments: [
            {
                author: { name: 'AgriBot Uganda', role: 'expert' },
                content: 'Lambda-cyhalothrin 5% EC works well on army worm. Apply at 300-500 ml per ha mixed in 200 L water. Spray in early morning or late evening when worms are feeding. Check Twiga Chemicals in Lira or any NAADS agent in Soroti. The Ministry of Agriculture emergency hotline is 0417-441-125.',
                isExpertAnswer: true, likes: 37,
            },
        ],
        isResolved: false,
    },
    {
        title: 'I doubled my banana yield using mulching – here is my experience',
        content: 'Last season I tried heavy mulching with dry banana leaves and grass around my Matooke plantation in Bushenyi. The results were amazing – I went from 12 bunches per 100 stools to 23 bunches. Mulching conserved moisture through the dry spell in February-March and I spent less on weeding. Happy to share more details for anyone interested.',
        author: { name: 'Joseph Tumwine', role: 'farmer', region: 'Western' },
        category: 'success_story',
        tags: ['banana', 'matooke', 'mulching', 'yield', 'Bushenyi'],
        views: 501, likes: 87,
        comments: [
            { author: { name: 'Esther Nakato', role: 'farmer' }, content: 'Thank you Joseph! What thickness of mulch did you apply? And did you face any termite problems?', isExpertAnswer: false, likes: 5 },
            { author: { name: 'Joseph Tumwine', role: 'farmer' }, content: 'About 15-20 cm thick. I did have some termites but applied Dursban around the base of each stool. That controlled it.', isExpertAnswer: false, likes: 9 },
        ],
        isResolved: false,
    },
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agribuddy');
    console.log('Connected to MongoDB');

    await Post.deleteMany({});
    console.log('Cleared posts collection');

    const result = await Post.insertMany(POSTS);
    console.log(`✅ Seeded ${result.length} community forum posts`);

    await mongoose.disconnect();
    console.log('Done');
}

seed().catch(err => { console.error(err); process.exit(1); });
