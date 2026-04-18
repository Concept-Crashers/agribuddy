const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        const apiKey = 'AIzaSyAUrMhMqheXwVrGfy3evlcK2TWOJGyyluA';
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
        
        const result = await model.generateContent("You are AgriBuddy. A farmer asks: what causes yellowing maize leaves? Give advice in under 130 characters.");
        const response = await result.response;
        console.log("✅ SUCCESS! AskBuddy says:", response.text());
    } catch (error) {
        console.error("❌ FAILED:", error.message);
    }
}

test();
