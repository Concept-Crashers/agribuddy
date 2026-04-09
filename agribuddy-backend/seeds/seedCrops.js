/**
 * Seed crop knowledge base for AgriBuddy Uganda.
 * Run: node seeds/seedCrops.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CropKnowledge = require('../models/CropKnowledge');

const CROPS = [
    {
        name: 'Matooke',
        localName: 'Matooke',
        scientificName: 'Musa acuminata (AAA group)',
        category: 'fruit',
        description: 'Matooke is the staple food of Uganda and the most important food crop in the Great Lakes region. It is a cooking banana eaten green or ripe and forms the base of the Ugandan diet.',
        growingConditions: {
            climate: 'Tropical humid',
            soilType: 'Deep, fertile, well-drained loam or clay-loam soils rich in organic matter. pH 5.5–7.0.',
            rainfall: '1200–2000 mm per year, well distributed',
            altitude: '0–2000 m above sea level',
            temperature: '20–30°C optimum',
        },
        plantingGuide: {
            season: 'Plant at start of rainy season (March–April or September–October). Can be planted year-round with irrigation.',
            spacing: '3 m × 3 m (1,100 plants/ha)',
            depth: 'Plant suckers 30–50 cm deep',
            germination: 'Suckers establish in 2–4 weeks',
            harvestTime: '9–12 months for first bunch; subsequent ratoons every 6–9 months',
        },
        commonDiseases: [
            {
                name: 'Banana Xanthomonas Wilt (BXW)',
                symptoms: ['Yellow wilting of leaves', 'Premature ripening of fingers', 'Brown discolouration of vascular tissue', 'Oozing yellow bacterial slime from cut stem'],
                severity: 'high',
                treatments: [
                    { name: 'Single stem removal', type: 'cultural', instructions: 'Remove and destroy all male buds and flowers with a clean panga immediately after fruit set. Sterilise panga between plants with 10% bleach solution.', availability: 'Always available', costEstimate: 'Free' },
                    { name: 'Uprooting and burning', type: 'cultural', instructions: 'For heavily infected mats, uproot entire plant, chop and bury or burn. Do not replant bananas for 6 months.', availability: 'Always available', costEstimate: 'Free' },
                ],
                preventionTips: ['Use clean disease-free planting material', 'Sterilise tools between plants', 'Remove male buds early', 'Restrict movement of people through plantation'],
            },
            {
                name: 'Black Sigatoka (Mycosphaerella fijiensis)',
                symptoms: ['Small brown streaks on leaves', 'Dark brown-black leaf spots with yellow halo', 'Early leaf death reducing photosynthesis'],
                severity: 'high',
                treatments: [
                    { name: 'Mancozeb 80% WP', type: 'chemical', instructions: 'Apply 2.5 kg per 200 L water. Spray every 14–21 days during wet season.', availability: 'Available at most agro-dealers', costEstimate: '22,000 UGX/kg' },
                    { name: 'Leaf pruning', type: 'cultural', instructions: 'Remove and destroy badly infected leaves. Improves air circulation.', availability: 'Always available', costEstimate: 'Free' },
                ],
                preventionTips: ['Plant resistant varieties like NARITA 4', 'Ensure good drainage', 'Avoid overhead irrigation', 'Apply mulch to reduce soil splash'],
            },
        ],
        nutritionalInfo: 'Rich in complex carbohydrates, potassium (467 mg/100g), vitamin B6, vitamin C. Low in fat. Provides good dietary energy for active farmers.',
        marketValue: '800–1,500 UGX per kg at farm gate; 2,000–3,000 UGX at Kampala markets',
        regions: ['Central', 'Western', 'Eastern', 'South Western'],
        tips: [
            'Apply thick mulch (15–20 cm) around banana stools to conserve moisture and suppress weeds',
            'Desuckering – keep only 1 mother plant + 1 follower + 1 sword sucker per mat',
            'Apply 200 g urea + 200 g muriate of potash per stool every 6 months for high yields',
            'Earthing up (mounding soil around base) prevents lodging of heavy bunches',
        ],
    },
    {
        name: 'Maize',
        localName: 'Kasooli',
        scientificName: 'Zea mays L.',
        category: 'grain',
        description: 'Maize is the most widely grown cereal in Uganda. It is a key food security crop as well as a major cash crop for smallholder farmers across all regions.',
        growingConditions: {
            climate: 'Sub-humid to semi-arid',
            soilType: 'Well-drained loam, clay-loam or sandy-loam. pH 5.8–7.0. Avoid waterlogged soils.',
            rainfall: '500–1200 mm per cropping season',
            altitude: '0–2400 m above sea level',
            temperature: '18–32°C; optimal 25°C',
        },
        plantingGuide: {
            season: 'Season A: March–August; Season B: September–December. Plant at first reliable rains.',
            spacing: '75 cm between rows × 25 cm between plants (2 seeds per hill, thin to 1). ~53,000 plants/ha.',
            depth: '5–7 cm planting depth',
            germination: '5–10 days',
            harvestTime: 'Early varieties (90 days), medium (120 days), late (150 days)',
        },
        commonDiseases: [
            {
                name: 'Fall Armyworm (Spodoptera frugiperda)',
                symptoms: ['Ragged holes in young leaves', 'Frass (sawdust-like droppings) in whorl', 'Straight rows of holes in leaves', 'Damage to ear and tassel'],
                severity: 'high',
                treatments: [
                    { name: 'Lambda-cyhalothrin 5% EC', type: 'chemical', instructions: 'Mix 25 ml in 10 L water. Apply into whorl of each plant, early morning or evening. Repeat after 7 days if infestation persists.', availability: 'Widely available at agro-dealers', costEstimate: '18,000–25,000 UGX per 500 ml' },
                    { name: 'Ash application', type: 'organic', instructions: 'Apply 2 tablespoons of wood ash into whorl of each plant at first sign of larvae. Repeat after rain.', availability: 'Widely available in villages', costEstimate: 'Free to very low cost' },
                ],
                preventionTips: ['Early planting (at onset of rains) reduces pest pressure', 'Scout fields twice weekly', 'Intercrop with legumes to disrupt pest cycles', 'Use push-pull with Desmodium between rows'],
            },
            {
                name: 'Maize Lethal Necrosis (MLN)',
                symptoms: ['Chlorosis (yellowing from leaf tip)', 'Dead heart symptom in young plants', 'Premature drying of entire plant', 'Poorly filled cobs'],
                severity: 'high',
                treatments: [
                    { name: 'Removal and burning', type: 'cultural', instructions: 'Remove and burn infected plants immediately. Do not compost MLN-infected material.', availability: 'Always available', costEstimate: 'Free' },
                ],
                preventionTips: ['Plant MLN-resistant varieties (e.g. LONGE 10H, SEEDCO SC403)', 'Control thrips and aphids that transmit the virus', 'Avoid planting near infected fields', 'Use certified seed only'],
            },
        ],
        nutritionalInfo: 'High in carbohydrates (72 g/100g), moderate protein (9 g/100g), contains B vitamins (B1, B3), iron, and magnesium. Yellow maize has beta-carotene (provitamin A).',
        marketValue: '800–1,200 UGX per kg grain at farm gate',
        regions: ['Eastern', 'Northern', 'Central', 'Western'],
        tips: [
            'Apply DAP fertiliser (50 kg/ha) at planting and urea (100 kg/ha) at 30 days after emergence (knee-high stage)',
            'Control weeds in first 6 weeks – weeds after this period reduce yield by 50%+',
            'Harvest when husks turn brown and grain moisture is below 15%',
            'Store in hermetic bags (PICS bags) to prevent weevil damage',
        ],
    },
    {
        name: 'Robusta Coffee',
        localName: 'Kokoa (general term)',
        scientificName: 'Coffea canephora var. robusta',
        category: 'cash_crop',
        description: 'Uganda is Africa\'s second largest coffee exporter. Robusta coffee, indigenous to Uganda, is mainly grown in the Buganda and Lake Victoria basin regions. It is the primary export crop and major source of forex.',
        growingConditions: {
            climate: 'Humid tropical',
            soilType: 'Deep fertile clay-loam, rich in organic matter. pH 5.5–6.5. Must be well-drained.',
            rainfall: '1200–1800 mm, bimodal',
            altitude: '900–1500 m above sea level optimal',
            temperature: '24–30°C',
        },
        plantingGuide: {
            season: 'Plant at start of long rains (March–April)',
            spacing: '3 m × 3 m (1,100 trees/ha)',
            depth: 'Plant in 60 cm × 60 cm × 60 cm pits filled with topsoil + compost',
            germination: 'Seeds germinate in 4–6 weeks; use vegetatively propagated stems (cuttings) for uniformity',
            harvestTime: 'First crop 3–4 years after planting. Peak production from year 6–10.',
        },
        commonDiseases: [
            {
                name: 'Coffee Wilt Disease (CWD / Fusarium xylarioides)',
                symptoms: ['Sudden wilting of branches or entire tree', 'Brown staining in vascular tissue (visible on cross-section)', 'Leaves remain attached on dead branches', 'White fungal mass at base in humid conditions'],
                severity: 'high',
                treatments: [
                    { name: 'Uprooting and burning', type: 'cultural', instructions: 'Remove infected trees completely, including major roots. Burn or bury material. Do not use infected wood as stakes. Avoid replanting coffee in same spot for 3+ years.', availability: 'Always available', costEstimate: 'Free' },
                ],
                preventionTips: ['Use CWD-resistant varieties from NACRRI (e.g. BP42, BP358)', 'Disinfect pruning tools with 10% bleach', 'Avoid wounding roots during cultivation', 'Contact NACRRI for free planting material'],
            },
            {
                name: 'Coffee Berry Borer (Hypothenemus hampei)',
                symptoms: ['Small circular entry holes in coffee berries', 'Premature berry drop', 'Internal tunnelling and damage to coffee bean'],
                severity: 'medium',
                treatments: [
                    { name: 'Endosulfan / Cypermethrin spray', type: 'chemical', instructions: 'Apply certified insecticide at berry formation (pin-head stage) and repeat at 4–6 week intervals during fruiting season.', availability: 'At certified agro-dealers', costEstimate: '25,000–35,000 UGX per litre' },
                    { name: 'Field sanitation', type: 'cultural', instructions: 'Collect all fallen berries (including bored ones) weekly. Do not leave dried cherries on trees or ground.', availability: 'Always available', costEstimate: 'Free' },
                ],
                preventionTips: ['Harvest all ripe berries promptly at peak', 'Strip-pick trees at end of season to remove all remaining berries', 'Introduce parasitoid wasps (Cephalonomia stephanoderis) for biological control'],
            },
        ],
        nutritionalInfo: 'Coffee is a beverage crop. Caffeine content 2.7% (higher than Arabica). Rich in antioxidants. Green bean exports earn Uganda approximately USD 600–800 million annually.',
        marketValue: '3,000–6,000 UGX per kg of fresh cherry; 8,000–12,000 UGX per kg parchment coffee',
        regions: ['Central', 'Western', 'Eastern'],
        tips: [
            'Mulch heavily (15–20 cm) with grass or coffee pulp around each tree – vital for moisture and weed control',
            'Prune coffee to 3–4 main stems (multiple-stem system) for higher yield and easier picking',
            'Apply fertiliser twice per year: NPK 17:17:17 at 200 g per tree before long and short rains',
            'Process cherries by wet method (pulping + fermentation) for premium quality export',
        ],
    },
    {
        name: 'Beans',
        localName: 'Ebijanjaalo',
        scientificName: 'Phaseolus vulgaris L.',
        category: 'legume',
        description: 'Common beans are the most important food legume in Uganda, providing protein and income for millions of smallholder farmers. Beans are grown in both seasons across all regions.',
        growingConditions: {
            climate: 'Sub-humid, cool to warm',
            soilType: 'Well-drained loam or sandy-loam soils. pH 6.0–7.0. Poor drainage causes root rot.',
            rainfall: '700–1200 mm per season',
            altitude: '0–2000 m above sea level',
            temperature: '18–28°C; cool nights favour pod filling',
        },
        plantingGuide: {
            season: 'Plant with first rains. Avoid late planting which increases disease pressure.',
            spacing: '50 cm between rows × 20 cm between plants (2 seeds per hole). ~100,000 plants/ha.',
            depth: '4–5 cm',
            germination: '5–8 days',
            harvestTime: 'Bushy types: 60–90 days. Climbing types: 90–120 days.',
        },
        commonDiseases: [
            {
                name: 'Angular Leaf Spot (Phaeoisariopsis griseola)',
                symptoms: ['Angular brown spots on leaves following leaf veins', 'Tan centres with dark borders', 'Premature leaf drop', 'Dark streaks on pods'],
                severity: 'high',
                treatments: [
                    { name: 'Mancozeb 80% WP', type: 'chemical', instructions: 'Mix 30 g per 10 L water. Spray at first sign of symptoms and repeat every 14 days until dry season.', availability: 'Widely available at agro-dealers', costEstimate: '22,000 UGX per kg' },
                ],
                preventionTips: ['Use resistant varieties (NABE 4, NABE 12C, K132)', 'Rotate beans with maize or sorghum every season', 'Avoid working in fields when leaves are wet', 'Collect and burn crop residues after harvest'],
            },
            {
                name: 'Bean Common Mosaic Virus (BCMV)',
                symptoms: ['Yellow-green mosaic pattern on leaves', 'Leaf distortion and puckering', 'Stunted plant growth', 'Reduced pod set'],
                severity: 'medium',
                treatments: [
                    { name: 'Remove infected plants', type: 'cultural', instructions: 'Remove symptomatic plants early before virus spreads. Do not compost infected material.', availability: 'Always available', costEstimate: 'Free' },
                    { name: 'Control aphid vectors', type: 'chemical', instructions: 'Apply imidacloprid or dimethoate to control aphids that transmit BCMV.', availability: 'Available at agro-dealers', costEstimate: '15,000–20,000 UGX per 100 ml' },
                ],
                preventionTips: ['Use certified BCMV-resistant seed (NABE 4, NABE 14)', 'Source seed from trusted agro-dealers only', 'Control aphids early in the season'],
            },
        ],
        nutritionalInfo: 'Excellent source of plant protein (21 g/100g dried), complex carbohydrates, iron (8 mg/100g), zinc, and folate. Critical for food security and maternal nutrition in Uganda.',
        marketValue: '1,500–2,500 UGX per kg dried beans at farm gate',
        regions: ['Central', 'Western', 'Eastern', 'Northern', 'South Western'],
        tips: [
            'Inoculate seeds with rhizobium bacteria (Biofix) before planting to fix atmospheric nitrogen – reduces fertiliser costs',
            'Never apply nitrogen fertiliser to beans – it suppresses root nodule nitrogen fixation',
            'Plant phosphorus fertiliser (SSP at 100 kg/ha) to improve root development',
            'Harvest pods in early morning to reduce shattering losses',
        ],
    },
    {
        name: 'Cassava',
        localName: 'Muvuuta',
        scientificName: 'Manihot esculenta Crantz',
        category: 'tuber',
        description: 'Cassava is one of the most important food security crops in Uganda, especially in Northern and Eastern Uganda. It is drought-tolerant and grown mainly for its starchy roots and leaves.',
        growingConditions: {
            climate: 'Tropical to sub-tropical, tolerates drought',
            soilType: 'Wide range of soils; prefers loose, well-drained sandy-loam. pH 5.5–6.5. Tolerates poor soils better than most crops.',
            rainfall: '600–1500 mm; highly drought tolerant once established',
            altitude: '0–1800 m above sea level',
            temperature: '25–35°C',
        },
        plantingGuide: {
            season: 'Plant at start of rains. Cuttings can be planted dry season in irrigated areas.',
            spacing: '1 m × 1 m (10,000 plants/ha)',
            depth: 'Stake cuttings 25–30 cm long planted at 45° angle, 10–15 cm deep',
            germination: 'Buds sprout in 7–14 days. Plant upright or angled cuttings with at least 5 buds.',
            harvestTime: '9–24 months depending on variety and use. Sweet varieties 9–12 months; bitter varieties 15–24 months.',
        },
        commonDiseases: [
            {
                name: 'Cassava Mosaic Disease (CMD)',
                symptoms: ['Mosaic yellow-green pattern on leaves', 'Leaf distortion and reduction', 'Stunted growth', 'Reduced root yield'],
                severity: 'high',
                treatments: [
                    { name: 'Roguing', type: 'cultural', instructions: 'Remove and destroy infected plants at first sign of symptoms to prevent spread by whitefly vectors.', availability: 'Always available', costEstimate: 'Free' },
                    { name: 'Whitefly control', type: 'chemical', instructions: 'Apply imidacloprid 70% WS as seed treatment or foliar spray at 0.5 g/L to reduce whitefly populations.', availability: 'Available at agro-dealers', costEstimate: '30,000 UGX per 100 g' },
                ],
                preventionTips: ['Use CMD-resistant varieties (NASE 14, NASE 19, TME 14)', 'Source cuttings only from disease-free fields', 'Plant early in season before whitefly build-up', 'Contact NACRRI for certified clean planting material'],
            },
            {
                name: 'Cassava Brown Streak Disease (CBSD)',
                symptoms: ['Yellow-brown streaks on stems', 'Feathery chlorosis on leaves (mild symptoms)', 'Brown corky necrosis inside roots – makes roots inedible', 'External appearance of roots can look normal'],
                severity: 'high',
                treatments: [
                    { name: 'Complete uprooting', type: 'cultural', instructions: 'Remove entire plant including all roots. Burn residues. CBSD has no chemical cure.', availability: 'Always available', costEstimate: 'Free' },
                ],
                preventionTips: ['USE CBSD-resistant varieties (NASE 14, Kiroba, Narocass 1)', 'Never replant cuttings from symptomatic plants', 'Test roots at harvest – brown corky tissue inside root = CBSD'],
            },
        ],
        nutritionalInfo: 'High caloric value from starch (38 g carbohydrates/100g fresh). Low protein (1.4 g/100g). Leaves are rich in protein and can be cooked as vegetables. Vitamin C present (21 mg/100g).',
        marketValue: 'Fresh roots: 300–600 UGX per kg. Dry cassava flour: 1,500–2,500 UGX per kg in Kampala.',
        regions: ['Northern', 'Eastern', 'Central', 'West Nile'],
        tips: [
            'Store harvested cuttings (stems) in shade for up to 3 months before planting season',
            'Intercrop cassava with beans or groundnuts to improve soil fertility and household nutrition',
            'Weed thoroughly in first 3 months – cassava is vulnerable to weed competition early on',
            'Harvest roots in the morning and process quickly – roots deteriorate within 24–48 hours of harvest',
        ],
    },
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agribuddy');
    console.log('Connected to MongoDB');

    await CropKnowledge.deleteMany({});
    console.log('Cleared CropKnowledge collection');

    const result = await CropKnowledge.insertMany(CROPS);
    console.log(`Seeded ${result.length} crops successfully`);

    await mongoose.disconnect();
    console.log('Done');
}

seed().catch(err => { console.error(err); process.exit(1); });
