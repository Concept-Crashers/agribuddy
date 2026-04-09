const Farmer = require('../models/Farmer');
const MarketPrice = require('../models/MarketPrice');
const geminiService = require('../services/geminiService');
const weatherService = require('../services/weatherService');
const smsService = require('../services/smsService');

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

/**
 * Handles incoming USSD requests from Africa's Talking API
 */
const handleUssdRequest = async (req, res) => {
    try {
        // Read variables sent via POST from our gateway
        const { sessionId, serviceCode, phoneNumber, text } = req.body;

        console.log(`Received USSD request from ${phoneNumber}, text: "${text}"`);

        let response = '';
        const textArray = text.split('*');
        const level = text === '' ? 0 : textArray.length;

        // Pagination Interceptor
        if (textArray.length > 0 && textArray[textArray.length - 1] === '98' && text !== '98') {
            const cacheData = ussdCache.get(sessionId);
            if (cacheData) {
                // Count how many '98's are at the end consecutively
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

        // Main Menu
        if (text === '') {
            response = `CON Welcome to AgriBuddy Uganda
1. Market Prices
2. Weather Forecast
3. Farming Tips
4. AskBuddy (AI)
5. My Account`;
        }

        // 1. Market Prices
        else if (text === '1') {
            response = `CON Select Crop Form Market Prices:
1. Maize
2. Beans
3. Coffee (Robusta)
4. Bananas (Matooke)`;
        } else if (text.startsWith('1*')) {
            const cropMap = { '1': 'Maize', '2': 'Beans', '3': 'Coffee (Robusta)', '4': 'Bananas (Matooke)' };
            const selectedCrop = cropMap[textArray[1]];

            if (selectedCrop) {
                if (!farmer.location && textArray.length === 2) {
                    response = `CON Please enter your district (e.g., Kampala) to get local prices for ${selectedCrop}:`;
                } else {
                    if (!farmer.location && textArray.length === 3) {
                        const newLocation = textArray[2];
                        if (newLocation && newLocation.trim() !== '') {
                            farmer.location = newLocation.trim();
                            await farmer.save();
                        }
                    }

                    const priceData = await MarketPrice.findOne({ cropName: selectedCrop, location: new RegExp(farmer.location || 'Kampala', 'i') }).sort({ dateUpdated: -1 });
                    if (priceData) {
                        response = `END The current price of ${selectedCrop} in ${priceData.location} is UGX ${priceData.price}/${priceData.unit}.\nUpdated: ${priceData.dateUpdated.toLocaleDateString()}`;
                    } else {
                        // Fallback to any location if local is not available
                        const anyPrice = await MarketPrice.findOne({ cropName: selectedCrop }).sort({ dateUpdated: -1 });
                        if (anyPrice) {
                            response = `END No local data. In ${anyPrice.location}, ${selectedCrop} is UGX ${anyPrice.price}/${anyPrice.unit}.\nUpdated: ${anyPrice.dateUpdated.toLocaleDateString()}`;
                        } else {
                            // Ultimate fallback
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
                }
            } else {
                response = `END Invalid selection.`;
            }
        }

        // 2. Weather Forecast
        else if (text === '2') {
            if (!farmer.location) {
                response = `CON Please enter your district (e.g., Kampala) to get your weather forecast:`;
            } else {
                const weatherStr = await weatherService.getWeather(farmer.location);
                response = `END ${weatherStr}`;
            }
        } else if (text.startsWith('2*')) {
            const newLocation = textArray[1];
            if (newLocation && newLocation.trim() !== '') {
                farmer.location = newLocation.trim();
                await farmer.save();
                const weatherStr = await weatherService.getWeather(farmer.location);
                response = `END ${weatherStr}`;
            } else {
                response = `END Invalid location. Please try again.`;
            }
        }

        // 3. Farming Tips
        else if (text === '3') {
            response = `CON Select Topic:
1. Post-harvest handling
2. Soil health
3. Pest control
4. Seasonal planting`;
        } else if (text.startsWith('3*')) {
            const topics = {
                '1': 'Post-harvest handling',
                '2': 'Soil health',
                '3': 'Pest control',
                '4': 'Seasonal planting'
            };
            const topic = topics[textArray[1]];
            if (topic) {
                try {
                    const prompt = `Provide actionable farming advice about ${topic} for farmers in Uganda. Be clear and helpful.`;
                    const tipData = await geminiService.getAgriculturalAdvice(prompt, "System prompt for farming advice.");
                    
                    const chunks = chunkText(`Tip: ${tipData.answer}`);
                    if (chunks.length > 1) {
                        ussdCache.set(sessionId, { chunks });
                        response = `CON ${chunks[0]}\n98. More`;
                    } else {
                        response = `END ${chunks[0]}`;
                    }
                } catch (err) {
                    console.error('Error fetching farming tip:', err);
                    response = `END Tip: Unable to fetch tip right now. Please try again later.`;
                }
            } else {
                response = `END Invalid selection.`;
            }
        }

        // 4. AskBuddy AI
        else if (text === '4') {
            response = `CON AskBuddy AI\nEnter your question about farming:`;
        } else if (text.startsWith('4*')) {
            const question = textArray.slice(1).join(' '); // Extract what the user typed
            
            // Asynchronously fetch from Gemini and send SMS to prevent USSD timeout blocks
            geminiService.getAgriculturalAdvice(question, `Farmer location: Uganda. Phone: ${phoneNumber}. Max 200 chars.`)
                .then(advice => {
                    return smsService.sendSMS(phoneNumber, `AskBuddy: ${advice.answer}`);
                })
                .catch(err => {
                    console.error('Background AskBuddy error:', err);
                });
            
            response = `END Thank you for asking Buddy. You will receive an SMS shortly with your answer.`;
        }

        // 5. My Account
        else if (text === '5') {
            response = `END My Account Details:
Phone: ${farmer.phoneNumber}
Language: ${farmer.languagePreference}
Joined: ${farmer.createdAt.toLocaleDateString()}`;
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

