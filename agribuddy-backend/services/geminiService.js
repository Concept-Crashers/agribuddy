const { GoogleGenerativeAI } = require('@google/generative-ai');

// Hard timeout to stay within USSD's ~10 second window
const withTimeout = (promise, ms) => {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), ms)
    );
    return Promise.race([promise, timeout]);
};

const getAgriculturalAdvice = async (question, context = '') => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are AgriBuddy, an agricultural expert for Ugandan small-scale farmers.

Context: ${context}
Question: ${question}

Give practical advice for Uganda. Be very concise - max 130 characters for USSD display.`;

        // Race against 8s timeout to stay within USSD limits
        const result = await withTimeout(model.generateContent(prompt), 8000);
        const response = await result.response;
        const text = response.text();

        return {
            success: true,
            answer: text.trim().substring(0, 155), // Hard cap for USSD
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error('AskBuddy Error:', error.message);

        if (error.status === 429) {
            return {
                success: false,
                answer: 'AskBuddy busy. Try again in 1 min.',
            };
        }
        if (error.message === 'Request timed out') {
            return {
                success: false,
                answer: 'AskBuddy took too long. Try a shorter question.',
            };
        }
        return {
            success: false,
            answer: 'AskBuddy unavailable. Try again later.',
        };
    }
};

module.exports = {
    getAgriculturalAdvice
};
