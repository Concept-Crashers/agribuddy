const Farmer = require('../models/Farmer');
const MarketPrice = require('../models/MarketPrice');
const geminiService = require('../services/geminiService');

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
                const priceData = await MarketPrice.findOne({ cropName: selectedCrop }).sort({ dateUpdated: -1 });
                if (priceData) {
                    response = `END The current price of ${selectedCrop} in ${priceData.location} is UGX ${priceData.price}/${priceData.unit}.
Updated: ${priceData.dateUpdated.toLocaleDateString()}`;
                } else {
                    // Fallback to static data if not in DB
                    const fallbackPrices = {
                        'Maize': '1,200/kg',
                        'Beans': '3,500/kg',
                        'Coffee (Robusta)': '8,000/kg',
                        'Bananas (Matooke)': '25,000/bunch'
                    };
                    response = `END The current price of ${selectedCrop} in Kampala is UGX ${fallbackPrices[selectedCrop]}.`;
                }
            } else {
                response = `END Invalid selection.`;
            }
        }

        // 2. Weather Forecast
        else if (text === '2') {
            response = `END Weather Forecast: Today will be partly cloudy with scattered showers in the afternoon.`;
        }

        // 3. Farming Tips
        else if (text === '3') {
            response = `CON Select Topic:
1. Post-harvest handling
2. Soil health
3. Pest control
4. Seasonal planting`;
        } else if (text.startsWith('3*')) {
            const tips = {
                '1': 'Dry maize to 13.5% moisture to prevent aflatoxins.',
                '2': 'Use organic compost to improve soil structure and water retention.',
                '3': 'Rotate crops (e.g. maize with beans) to break pest life cycles.',
                '4': 'Plant maize at the onset of the first rains (March/April).'
            };
            const tip = tips[textArray[1]];
            response = tip ? `END Tip: ${tip}` : `END Invalid selection.`;
        }

        // 4. AskBuddy AI
        else if (text === '4') {
            response = `CON AskBuddy AI
Enter your question about farming:`;
        } else if (text.startsWith('4*')) {
            const question = textArray.slice(1).join(' '); // Simple way to get the question
            const advice = await geminiService.getAgriculturalAdvice(question, `Farmer location: Uganda. Phone: ${phoneNumber}`);
            response = `END Buddy: ${advice.answer}`;
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

