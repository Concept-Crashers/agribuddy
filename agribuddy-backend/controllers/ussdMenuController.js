const Farmer = require('../models/Farmer');
const MarketPrice = require('../models/MarketPrice');
const DiseaseAlert = require('../models/DiseaseAlert');
const weatherService = require('../services/weatherService');

const ussdCache = new Map();

function chunkText(text, limit = 130) {
    const words = text.split(' ');
    const chunks = [];
    let currentChunk = '';
    
    for (const word of words) {
        if ((currentChunk + ' ' + word).trim().length <= limit) {
            currentChunk = (currentChunk + ' ' + word).trim();
        } else {
            chunks.push(currentChunk);
            currentChunk = word;
        }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}

const handleUssdRequest = async (req, res) => {
    try {
        const { sessionId, serviceCode, phoneNumber, text } = req.body;
        console.log(`Received USSD request from ${phoneNumber}, text: "${text}"`);

        let response = '';
        const textArray = text.split('*');
        const level = text === '' ? 0 : textArray.length;

        // Pagination Interceptor
        if (textArray.length > 0 && textArray[textArray.length - 1] === '98' && text !== '98') {
            const cacheData = ussdCache.get(sessionId);
            if (cacheData) {
                let page = 0;
                for (let i = textArray.length - 1; i >= 0; i--) {
                    if (textArray[i] === '98') page++;
                    else break;
                }
                
                if (page < cacheData.chunks.length) {
                    const isLastPage = page === cacheData.chunks.length - 1;
                    response = isLastPage ? `END ${cacheData.chunks[page]}` : `CON ${cacheData.chunks[page]}\n98. More`;
                    res.set('Content-Type', 'text/plain');
                    return res.send(response);
                }
            }
            response = `END Session expired or invalid option. Please try again.`;
            res.set('Content-Type', 'text/plain');
            return res.send(response);
        }

        // Look up or create farmer
        let farmer = await Farmer.findOne({ phoneNumber });
        if (!farmer) {
            farmer = await Farmer.create({ phoneNumber });
        }

        // -----------------------------
        // REGISTRATION / ONBOARDING FLOW
        // -----------------------------
        if (!farmer.isRegistered) {
            if (level === 0) {
                response = `CON Welcome to AgriBuddy!\nTo set up your account, please reply with your Name:`;
            } else if (level === 1) {
                response = `CON Thank you, ${textArray[0]}.\nWhat is your District? (e.g. Kampala):`;
            } else if (level === 2) {
                farmer.name = textArray[0];
                farmer.location = textArray[1];
                farmer.isRegistered = true;
                await farmer.save();
                response = `END Registration successful!\nPlease dial the code again to access the main menu.`;
            } else {
                response = `END Invalid entry. Please dial again.`;
            }
            res.set('Content-Type', 'text/plain');
            return res.send(response);
        }

        // -----------------------------
        // REGISTERED USER MAIN FLOW
        // -----------------------------

        // Main Menu
        if (level === 0) {
            response = `CON Welcome ${farmer.name || 'Farmer'} 
1. Market Prices
2. Weather Forecast
3. Pest & Disease Alerts
4. Farm Input Marketplace
5. My Account
6. Subscriptions`;
        }

        // 1. Market Prices
        else if (text === '1') {
            response = `CON Select Crop for Market Prices:
1. Maize
2. Beans
3. Coffee (Robusta)
4. Bananas (Matooke)`;
        } else if (text.startsWith('1*')) {
            const cropMap = { '1': 'Maize', '2': 'Beans', '3': 'Coffee (Robusta)', '4': 'Bananas (Matooke)' };
            const selectedCrop = cropMap[textArray[1]];

            if (selectedCrop) {
                const priceData = await MarketPrice.findOne({ cropName: selectedCrop, location: new RegExp(farmer.location || 'Kampala', 'i') }).sort({ dateUpdated: -1 });
                if (priceData) {
                    response = `END The current price of ${selectedCrop} in ${priceData.location} is UGX ${priceData.price}/${priceData.unit}.\nUpdated: ${priceData.dateUpdated.toLocaleDateString()}`;
                } else {
                    const anyPrice = await MarketPrice.findOne({ cropName: selectedCrop }).sort({ dateUpdated: -1 });
                    if (anyPrice) {
                        response = `END No local data. In ${anyPrice.location}, ${selectedCrop} is UGX ${anyPrice.price}/${anyPrice.unit}.\nUpdated: ${anyPrice.dateUpdated.toLocaleDateString()}`;
                    } else {
                        const fallbackPrices = {
                            'Maize': '1,200',
                            'Beans': '3,500',
                            'Coffee (Robusta)': '8,000',
                            'Bananas (Matooke)': '25,000'
                        };
                        const unit = selectedCrop === 'Bananas (Matooke)' ? 'bunch' : 'kg';
                        response = `END The current price of ${selectedCrop} is approx UGX ${fallbackPrices[selectedCrop]}/${unit}.`;
                    }
                }
            } else {
                response = `END Invalid selection.`;
            }
        }

        // 2. Weather Forecast
        else if (text === '2') {
            const weatherStr = await weatherService.getWeather(farmer.location || 'Kampala');
            response = `END ${weatherStr}`;
        }

        // 3. Pest & Disease Alerts
        else if (text === '3') {
            // Find high severity alerts or alerts in their district
            const alerts = await DiseaseAlert.find({ 
                $or: [
                    { region: new RegExp(farmer.location || 'XXXXX', 'i') }, 
                    { severity: { $in: ['high', 'critical'] } }
                ]
            }).sort({ dateIssued: -1 }).limit(5);

            if (!alerts || alerts.length === 0) {
                response = `END You currently have no active active disease alerts for your region. Your crops are safe!`;
            } else {
                // Save alert IDs to session memory cache if needed, but since we rely on array index we reproduce the search
                response = `CON Active Pest/Disease Alerts:\n`;
                alerts.forEach((alert, index) => {
                    response += `${index + 1}. ${alert.title}\n`;
                });
            }
        } else if (text.startsWith('3*')) {
            const alertIndex = parseInt(textArray[1]) - 1;
            const alerts = await DiseaseAlert.find({ 
                $or: [
                    { region: new RegExp(farmer.location || 'XXXXX', 'i') }, 
                    { severity: { $in: ['high', 'critical'] } }
                ]
            }).sort({ dateIssued: -1 }).limit(5);

            if (alerts[alertIndex]) {
                const alert = alerts[alertIndex];
                const symptoms = alert.symptoms && alert.symptoms.length ? alert.symptoms.join(', ') : 'Unknown';
                const prevention = alert.prevention && alert.prevention.length ? alert.prevention.join(', ') : 'Contact extension worker';
                const msg = `Alert: ${alert.title}\nSymptoms: ${symptoms}\nAction: ${prevention}`;
                
                const chunks = chunkText(msg);
                if (chunks.length > 1) {
                    ussdCache.set(sessionId, { chunks });
                    response = `CON ${chunks[0]}\n98. More`;
                } else {
                    response = `END ${chunks[0]}`;
                }
            } else {
                response = `END Invalid selection.`;
            }
        }

        // 4. Farm Input Marketplace
        else if (text === '4') {
            response = `CON Select Marketplace Category:
1. Seeds
2. Crop Protection
3. Crop Nutrition
4. Equipment
5. Animal Husbandry
6. Organic
7. Services`;
        }
        // 4*X — Level 2: Subcategory
        else if (text.startsWith('4*') && level === 2) {
            const subcategoryMenus = {
                '1': `CON Seeds:\n1. Open Pollinated\n2. Hybrid Seeds\n3. Vegetable Seeds\n4. Pasture/Forage Seeds`,
                '2': `CON Crop Protection:\n1. Insecticides\n2. Herbicides\n3. Fungicides\n4. Bio-Pesticides`,
                '3': `CON Crop Nutrition:\n1. Fertilizers (NPK)\n2. Foliar Feeds\n3. Soil Amendments\n4. Micronutrients`,
                '4': `CON Equipment:\n1. Hand Tools\n2. Irrigation\n3. Sprayers\n4. Post-Harvest`,
                '5': `CON Animal Husbandry:\n1. Animal Feeds\n2. Veterinary Drugs\n3. Vaccines\n4. Supplements`,
                '6': `CON Organic:\n1. Organic Fertilizers\n2. Bio-Fungicides\n3. Compost/Humus\n4. Organic Pesticides`,
                '7': `CON Services:\n1. Soil Testing\n2. Drone Spraying\n3. Agronomist Visit\n4. Land Preparation`,
            };
            response = subcategoryMenus[textArray[1]] || `END Invalid selection.`;
        }
        // 4*X*Y — Level 3: Fetch real products from DB
        else if (text.startsWith('4*') && level === 3) {
            const categoryMap = {
                '1': 'seeds', '2': 'crop_protection', '3': 'crop_nutrition',
                '4': 'equipment', '5': 'animal_husbandry', '6': 'organic', '7': 'services'
            };
            const selectedCategory = categoryMap[textArray[1]];

            if (selectedCategory) {
                const { Product } = require('../models/Marketplace');
                const items = await Product.find({ category: selectedCategory, isAvailable: true })
                    .sort({ rating: -1 })
                    .limit(4);

                if (!items || items.length === 0) {
                    response = `END No products listed in this category yet. Check back soon or contact AgriBuddy support.`;
                } else {
                    // Cache products to session so user can pick one
                    const productCache = items.map((p, i) => ({
                        index: i + 1,
                        name: p.name,
                        price: p.price,
                        unit: p.unit,
                        sellerPhone: p.seller?.phone || 'N/A',
                        sellerName: p.seller?.name || 'Seller',
                        _id: p._id.toString()
                    }));
                    ussdCache.set(`${sessionId}_products`, productCache);

                    let listText = `CON Available Products:\n`;
                    productCache.forEach(p => {
                        listText += `${p.index}. ${p.name} - UGX ${p.price.toLocaleString()}/${p.unit}\n`;
                    });
                    response = listText;
                }
            } else {
                response = `END Invalid selection.`;
            }
        }
        // 4*X*Y*Z — Level 4: Get seller contact info via SMS
        else if (text.startsWith('4*') && level === 4) {
            const cachedProducts = ussdCache.get(`${sessionId}_products`);
            const selectedIndex = parseInt(textArray[3]);
            const selectedProduct = cachedProducts?.find(p => p.index === selectedIndex);

            if (selectedProduct) {
                // Send SMS with seller contact details
                const smsService = require('../services/smsService');
                const smsMsg = `AgriBuddy Marketplace: You enquired about "${selectedProduct.name}" at UGX ${selectedProduct.price.toLocaleString()}. Contact: ${selectedProduct.sellerName} on ${selectedProduct.sellerPhone}. Reply HELP to 8200 for assistance.`;
                await smsService.sendSMS(phoneNumber, smsMsg);

                response = `END Contact details for ${selectedProduct.name} have been sent to your phone via SMS. Call the seller to complete your purchase!`;
                ussdCache.delete(`${sessionId}_products`);
            } else {
                response = `END Invalid selection or session expired. Please try again.`;
            }
        }

        // 5. My Account
        else if (text === '5') {
            response = `END My Account Details:
Name: ${farmer.name || 'Not set'}
Phone: ${farmer.phoneNumber}
District: ${farmer.location || 'Not set'}
Subscription: ${farmer.subscriptions?.isActive ? 'Active (' + farmer.subscriptions.focus + ')' : 'None'}`;
        }

        // 6. Subscriptions
        else if (text === '6') {
            if (farmer.subscriptions?.isActive) {
                response = `CON You have an active subscription for ${farmer.subscriptions.focus}.
1. Cancel Subscription`;
            } else {
                response = `CON Subscribe to automated AI tips! What crop/animal do you want tips for? (e.g. Coffee, Poultry)`;
            }
        } else if (text.startsWith('6*')) {
            if (farmer.subscriptions?.isActive) {
                if (textArray[1] === '1') {
                    farmer.subscriptions.isActive = false;
                    await farmer.save();
                    response = `END Subscription cancelled successfully.`;
                } else {
                    response = `END Invalid selection.`;
                }
            } else {
                if (level === 2) {
                    response = `CON You chose ${textArray[1]}.\nSelect Duration:\n1. 1 Week\n2. 1 Month\n3. 1 Year`;
                } else if (level === 3) {
                    const focus = textArray[1];
                    const durationChoice = textArray[2];
                    
                    farmer.subscriptions.isActive = true;
                    farmer.subscriptions.focus = focus;
                    
                    const now = new Date();
                    if (durationChoice === '1') {
                        now.setDate(now.getDate() + 7);
                        farmer.subscriptions.duration = '1 Week';
                    } else if (durationChoice === '2') {
                        now.setMonth(now.getMonth() + 1);
                        farmer.subscriptions.duration = '1 Month';
                    } else if (durationChoice === '3') {
                        now.setFullYear(now.getFullYear() + 1);
                        farmer.subscriptions.duration = '1 Year';
                    } else {
                        return res.send(`END Invalid duration.`);
                    }
                    
                    farmer.subscriptions.expiresAt = now;
                    if (!farmer.primaryCrops.includes(focus)) {
                        farmer.primaryCrops.push(focus);
                    }
                    
                    await farmer.save();
                    response = `END You are now subscribed to automated tips for ${focus} for ${farmer.subscriptions.duration}!`;
                }
            }
        }

        // Default fallback
        else {
            response = `END Invalid entry. Please try again.`;
        }

        // Send the response back to the API
        res.set('Content-Type', 'text/plain');
        res.send(response);
    } catch (error) {
        console.error('USSD Error:', error);
        res.set('Content-Type', 'text/plain');
        res.send('END A system error occurred. Please try again later.');
    }
};

module.exports = {
    handleUssdRequest
};
