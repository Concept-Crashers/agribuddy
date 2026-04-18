const geminiService = require('../services/geminiService');
const smsService = require('../services/smsService');
const weatherService = require('../services/weatherService');
const Farmer = require('../models/Farmer');

const handleIncomingSMS = async (req, res) => {
    try {
        const { from, text } = req.body;
        
        console.log(`Received incoming SMS from ${from}: "${text}"`);
        
        // Ensure success response is sent quickly to prevent AT retries
        res.status(200).send('Success');
        
        const upperText = text.trim().toUpperCase();
        
        let farmer = await Farmer.findOne({ phoneNumber: from });
        
        if (upperText.startsWith('WEATHER')) {
            const loc = farmer?.location || upperText.replace('WEATHER', '').trim() || 'Kampala';
            const weather = await weatherService.getWeather(loc);
            await smsService.sendSMS(from, `AgriBuddy Weather for ${loc}: ${weather}`);
            return;
        }

        // AskBuddy AI Logic
        const prompt = `Farmer phone: ${from}. ${farmer?.location ? 'Location: ' + farmer.location + '. ' : ''}${farmer?.primaryCrops?.length ? 'Focus: ' + farmer.primaryCrops.join(',') + '. ' : ''}Question: ${text}. Reply specifically and helpfully via SMS in approx 140 chars.`;
        
        const advice = await geminiService.getAgriculturalAdvice(prompt, "System prompt for SMS framing advice.");
        await smsService.sendSMS(from, `AskBuddy: ${advice.answer}`);
        
    } catch (error) {
        console.error('SMS incoming error:', error);
    }
};

module.exports = { handleIncomingSMS };
