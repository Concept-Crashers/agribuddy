const geminiService = require('./geminiService');

/**
 * Fetches a simulated weather forecast using Gemini.
 * @param {string} location - The district or location in Uganda.
 * @returns {Promise<string>} The generated weather forecast string.
 */
const getWeather = async (location) => {
    try {
        const prompt = `Give a realistic but brief 1-2 sentence weather forecast for farmers today in ${location}, Uganda. Format exactly like this: "Today in ${location}: [Forecast]". Do NOT include any markdown or asterisks. Keep the entire response under 120 characters so it fits easily within USSD limits.`;
        const context = "System prompt instructing Gemini to act as a concise weather API.";
        
        const advice = await geminiService.getAgriculturalAdvice(prompt, context);
        return advice.answer;
    } catch (error) {
        console.error('Error fetching weather:', error);
        return `Unable to fetch weather for ${location} right now. Please try again later.`;
    }
};

module.exports = { getWeather };
