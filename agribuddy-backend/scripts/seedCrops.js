/**
 * Seed script – populates the CropKnowledge collection with 20 commonly grown
 * crops in Uganda. Run once:  node scripts/seedCrops.js
 */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const CropKnowledge = require('../models/CropKnowledge');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agribuddy';

const crops = [
    {
        name: 'Maize',
        localName: 'Kasooli',
        scientificName: 'Zea mays',
        category: 'grain',
        description: 'Maize is the most widely grown cereal crop in Uganda, serving as a staple food and cash crop.',
        growingConditions: {
            climate: 'Warm tropical climate',
            soilType: 'Well-drained loam or sandy loam soils',
            rainfall: '600–1200 mm per year',
            altitude: '0–2400 m above sea level',
            temperature: '20–30°C',
        },
        plantingGuide: {
            season: 'March–April (first season), August–September (second season)',
            spacing: '75 cm between rows, 25–30 cm between plants',
            depth: '3–5 cm',
            germination: '5–7 days',
            harvestTime: '90–120 days depending on variety',
        },
        commonDiseases: [
            {
                name: 'Maize Streak Virus',
                symptoms: ['Yellow streaks on leaves', 'Stunted growth', 'Reduced yield'],
                severity: 'high',
                treatments: [
                    { name: 'Use resistant varieties', type: 'cultural', instructions: 'Plant MSV-resistant varieties like LONGE 10H' },
                ],
                preventionTips: ['Plant early to avoid peak leafhopper season', 'Remove infected plants immediately'],
            },
            {
                name: 'Gray Leaf Spot',
                symptoms: ['Gray to tan rectangular lesions on leaves', 'Leaf blight in severe infections'],
                severity: 'medium',
                treatments: [
                    { name: 'Fungicide application', type: 'chemical', instructions: 'Apply mancozeb at first sign of symptoms', availability: 'Agro-input shops' },
                ],
                preventionTips: ['Crop rotation', 'Remove crop residues after harvest'],
            },
        ],
        nutritionalInfo: 'Rich in carbohydrates, fibre, and B vitamins. Good source of energy.',
        marketValue: '800–1,200 UGX per kg',
        regions: ['Central', 'Eastern', 'Northern', 'Western'],
        tips: ['Use certified seed for higher yields', 'Apply nitrogen fertiliser in splits', 'Weed early (2–6 weeks after planting)'],
    },
    {
        name: 'Banana (Matooke)',
        localName: 'Matooke',
        scientificName: 'Musa acuminata',
        category: 'fruit',
        description: 'The East African Highland Banana (Matooke) is Uganda\'s most important food security crop, especially in the central and western regions.',
        growingConditions: {
            climate: 'Humid tropical',
            soilType: 'Deep, fertile, loam soils with good drainage',
            rainfall: '1200–2000 mm per year',
            altitude: '1000–2000 m above sea level',
            temperature: '20–30°C',
        },
        plantingGuide: {
            season: 'Year-round with irrigation, best at start of rains',
            spacing: '3 m × 3 m',
            depth: 'Plant sucker 30 cm deep',
            germination: 'N/A (propagated by suckers)',
            harvestTime: '9–12 months after planting',
        },
        commonDiseases: [
            {
                name: 'Banana Xanthomonas Wilt (BXW)',
                symptoms: ['Wilting and yellowing of leaves', 'Rotting of internal fruit', 'Premature ripening'],
                severity: 'high',
                treatments: [
                    { name: 'Remove infected plants', type: 'cultural', instructions: 'Cut and bury infected plants. Disinfect tools with 1% bleach or fire.' },
                ],
                preventionTips: ['Use clean planting material', 'Desuckering with sterilised tools', 'Do not bring plants from infected gardens'],
            },
            {
                name: 'Black Sigatoka',
                symptoms: ['Dark streaks on leaves', 'Premature leaf death', 'Reduced bunch size'],
                severity: 'medium',
                treatments: [
                    { name: 'Fungicide spray', type: 'chemical', instructions: 'Apply propiconazole or mancozeb every 21 days during wet seasons', availability: 'Agro-vet shops', costEstimate: '15,000–30,000 UGX per treatment' },
                ],
                preventionTips: ['Remove dried leaves', 'Avoid overhead irrigation', 'Improve spacing for air circulation'],
            },
        ],
        nutritionalInfo: 'High in carbohydrates, potassium, and vitamins B6 and C.',
        marketValue: '500–800 UGX per kg (bunch price varies)',
        regions: ['Central', 'Western', 'Buganda'],
        tips: ['Mulch heavily to retain moisture and suppress weeds', 'Desuck regularly, keeping 1 mother and 1 follower', 'Support heavy bunches with a pole'],
    },
    {
        name: 'Coffee (Robusta)',
        localName: 'Kawawa',
        scientificName: 'Coffea canephora',
        category: 'cash_crop',
        description: 'Robusta coffee is Uganda\'s leading export crop, grown mainly in the Lake Victoria basin and along the Albertine Rift.',
        growingConditions: {
            climate: 'Humid tropical',
            soilType: 'Deep, well-drained volcanic loam',
            rainfall: '1500–2000 mm per year',
            altitude: '0–1500 m above sea level',
            temperature: '22–26°C',
        },
        plantingGuide: {
            season: 'Plant at start of rainy season',
            spacing: '3 m × 3 m',
            depth: 'Plant seedling at same depth as nursery',
            germination: '30–40 days from seed',
            harvestTime: 'First harvest 3 years after planting, peak at 5–7 years',
        },
        commonDiseases: [
            {
                name: 'Coffee Wilt Disease (Tracheomycosis)',
                symptoms: ['Sudden wilting of branches', 'Brown discolouration of wood', 'Complete plant death'],
                severity: 'high',
                treatments: [
                    { name: 'Uproot and destroy', type: 'cultural', instructions: 'Remove and burn affected plants. Replace with resistant varieties.' },
                ],
                preventionTips: ['Use certified resistant planting material', 'Disinfect pruning tools', 'Avoid movement of soil from infected gardens'],
            },
            {
                name: 'Coffee Berry Disease (CBD)',
                symptoms: ['Dark sunken lesions on berries', 'Premature berry drop', 'Shrivelled beans'],
                severity: 'high',
                treatments: [
                    { name: 'Copper-based fungicides', type: 'chemical', instructions: 'Spray Copper Oxychloride or Bordeaux mixture at flowering and berry formation', costEstimate: '20,000–40,000 UGX per application' },
                ],
                preventionTips: ['Timely harvesting of ripe berries', 'Good sanitation in the garden', 'Plant resistant varieties where available'],
            },
        ],
        nutritionalInfo: 'Stimulant beverage; source of antioxidants.',
        marketValue: '6,000–9,000 UGX per kg (parchment)',
        regions: ['Central', 'Western', 'Rwenzori'],
        tips: ['Regular pruning improves yield and air circulation', 'Shade trees increase berry quality', 'Pulp immediately after harvesting to avoid fermentation'],
    },
    {
        name: 'Cassava',
        localName: 'Muwogo',
        scientificName: 'Manihot esculenta',
        category: 'root',
        description: 'Cassava is a vital food security crop in Uganda, drought-tolerant and grown across all regions.',
        growingConditions: {
            climate: 'Tropical, tolerates dry spells',
            soilType: 'Sandy loam to loam, well-drained',
            rainfall: '500–1500 mm per year',
            altitude: '0–1800 m above sea level',
            temperature: '25–35°C',
        },
        plantingGuide: {
            season: 'At the start of the rainy season',
            spacing: '1 m × 1 m',
            depth: 'Stake cuttings at 45° angle, 30 cm deep',
            germination: 'Sprouts in 7–14 days',
            harvestTime: '9–24 months depending on variety',
        },
        commonDiseases: [
            {
                name: 'Cassava Mosaic Disease (CMD)',
                symptoms: ['Mosaic yellowing of leaves', 'Distorted leaves', 'Reduced tuber yield'],
                severity: 'high',
                treatments: [
                    { name: 'Use CMD-resistant varieties', type: 'cultural', instructions: 'Plant NAROCASS 1, NAROCASS 2, TME 14, or other NARO-released resistant varieties.' },
                    { name: 'Roguing', type: 'cultural', instructions: 'Remove and destroy severely infected plants at first sign to prevent whitefly spread.' },
                ],
                preventionTips: ['Source clean planting material from certified nurseries', 'Control whitefly populations', 'Intercrop with non-host crops'],
            },
        ],
        nutritionalInfo: 'High in carbohydrates; leaves are rich in protein and vitamins.',
        marketValue: '300–600 UGX per kg (fresh roots)',
        regions: ['Northern', 'Eastern', 'Central', 'Western'],
        tips: ['Harvest before 18 months to avoid HCN build-up in bitter varieties', 'Leave some soil mounds to prevent waterlogging', 'Process flour, fufu, or chips to add value'],
    },
    {
        name: 'Sweet Potato',
        localName: 'Lumonde',
        scientificName: 'Ipomoea batatas',
        category: 'tuber',
        description: 'Sweet potato is a fast-maturing, nutritious tuber crop grown across Uganda, especially in Eastern Uganda.',
        growingConditions: {
            climate: 'Warm tropical',
            soilType: 'Sandy loam, well-drained',
            rainfall: '500–1000 mm per year',
            altitude: '0–2000 m above sea level',
            temperature: '24–30°C',
        },
        plantingGuide: {
            season: 'March–April or September–October',
            spacing: '90 cm between ridges, 30 cm between plants',
            depth: 'Plant vine cuttings 5–10 cm deep',
            germination: 'Roots in 7–10 days',
            harvestTime: '3–6 months',
        },
        commonDiseases: [
            {
                name: 'Sweet Potato Virus Disease (SPVD)',
                symptoms: ['Severe leaf distortion', 'Chlorotic mottling', 'Stunted growth and low yield'],
                severity: 'high',
                treatments: [
                    { name: 'Use clean planting material', type: 'cultural', instructions: 'Source virus-free vines from certified nurseries or tissue culture labs.' },
                ],
                preventionTips: ['Roguing of infected plants', 'Control aphid and whitefly vectors', 'Rotate with non-host crops for 1–2 seasons'],
            },
        ],
        nutritionalInfo: 'Orange-fleshed varieties are very rich in beta-carotene (Vitamin A), also high in carbohydrates.',
        marketValue: '500–900 UGX per kg',
        regions: ['Eastern', 'Northern', 'Central'],
        tips: ['Orange-fleshed varieties fetch premium prices and improve child nutrition', 'Mulching conserves moisture and keeps tubers clean', 'Process into flour or chips for longer shelf-life'],
    },
    {
        name: 'Beans (Common)',
        localName: 'Ebijanjaalo',
        scientificName: 'Phaseolus vulgaris',
        category: 'legume',
        description: 'Common beans are a major source of protein and income for Ugandan smallholder farmers, grown in two seasons per year.',
        growingConditions: {
            climate: 'Warm tropical, sensitive to waterlogging',
            soilType: 'Loam, well-drained, slightly acidic',
            rainfall: '600–1200 mm per year',
            altitude: '1000–2200 m above sea level',
            temperature: '18–24°C',
        },
        plantingGuide: {
            season: 'March (first season), September (second season)',
            spacing: '45–50 cm between rows, 10–15 cm between plants',
            depth: '3–5 cm',
            germination: '5–7 days',
            harvestTime: '60–90 days',
        },
        commonDiseases: [
            {
                name: 'Bean Common Mosaic Virus (BCMV)',
                symptoms: ['Mosaic pattern on leaves', 'Leaf curl', 'Stunted plants and low pod fill'],
                severity: 'medium',
                treatments: [
                    { name: 'Plant BCMV-resistant varieties', type: 'cultural', instructions: 'Use varieties like NABE 4, NABE 15, K-132.' },
                ],
                preventionTips: ['Avoid saving seed from infected plants', 'Control aphid vectors with neem spray', 'Use certified seed'],
            },
            {
                name: 'Angular Leaf Spot',
                symptoms: ['Angular brown lesions on leaves', 'Water-soaked spots on pods', 'Premature leaf drop'],
                severity: 'medium',
                treatments: [
                    { name: 'Mancozeb spray', type: 'chemical', instructions: 'Spray at 2-week intervals from flowering', costEstimate: '8,000–15,000 UGX per spray' },
                ],
                preventionTips: ['Use certified, disease-free seed', 'Avoid overhead irrigation', 'Practice crop rotation'],
            },
        ],
        nutritionalInfo: 'Excellent source of plant protein (20–25%), iron, and folate.',
        marketValue: '2,000–3,500 UGX per kg (dry beans)',
        regions: ['Western', 'Central', 'Eastern'],
        tips: ['Inoculate seed with Rhizobium to fix nitrogen and reduce fertiliser costs', 'Harvest when 80% of pods are dry to avoid shattering', 'Store in hermetic bags to prevent weevil damage'],
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        for (const crop of crops) {
            await CropKnowledge.updateOne({ name: crop.name }, crop, { upsert: true });
            console.log(`Upserted: ${crop.name}`);
        }

        console.log(`\n✅ Seeded ${crops.length} crops successfully.`);
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();
