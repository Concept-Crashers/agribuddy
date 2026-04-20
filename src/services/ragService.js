import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// In-memory knowledge base for agricultural information
// In production, this would be replaced with a vector database like Chroma or Pinecone
const agriculturalKnowledge = [
    {
        topic: 'Coffee Farming in Uganda',
        content: `Coffee is Uganda's leading export crop. Arabica coffee grows best in highland areas (1,500-2,500m) with temperatures of 15-24°C. Robusta thrives in lowland areas (900-1,500m) with temperatures of 18-36°C. Key varieties include Ruiru 11 (disease-resistant Arabica) and Nganda (high-yielding Robusta). Planting season: March-May and September-November. Spacing: 2.5m x 2.5m for Arabica, 3m x 3m for Robusta.`,
    },
    {
        topic: 'Maize Cultivation',
        content: `Maize is a staple food crop in Uganda. Best grown in areas with 500-800mm annual rainfall. Planting seasons: First season (March-May), Second season (August-September). Popular varieties: Longe 5, Longe 10H (hybrid), SC627 (drought-resistant). Spacing: 75cm between rows, 25-30cm within rows. Fertilizer: DAP at planting (50kg/acre), Urea top-dressing (50kg/acre) at 4-6 weeks.`,
    },
    {
        topic: 'Cassava Production',
        content: `Cassava is drought-tolerant and grows well across Uganda. Planting: Use healthy stem cuttings (20-25cm long) from 8-12 month old plants. Spacing: 1m x 1m (10,000 plants/hectare). Varieties: NASE 14, NASE 19 (high-yielding), TME 14 (disease-resistant). Harvest: 12-18 months after planting. Common diseases: Cassava Mosaic Disease (CMD), Cassava Brown Streak Disease (CBSD).`,
    },
    {
        topic: 'Banana Farming',
        content: `Bananas are a major food and cash crop in Uganda. Types: Matooke (cooking banana), Bogoya (sweet banana), Gonja (roasting banana). Planting: Year-round in areas with good rainfall (1,200-2,000mm annually). Spacing: 3m x 3m. Soil: Well-drained, fertile soils rich in organic matter. Mulching is essential. Common pests: Banana weevils, nematodes. Diseases: Panama disease, Black Sigatoka.`,
    },
    {
        topic: 'Soil Management',
        content: `Uganda has diverse soil types. Volcanic soils (Mt. Elgon, Rwenzori) are very fertile. Laterite soils (most of Uganda) need organic matter addition. pH: Most crops prefer 5.5-6.5. Soil testing recommended every 2-3 years. Organic matter: Add compost, manure, or mulch. Crop rotation prevents soil depletion. Cover crops like beans, groundnuts fix nitrogen.`,
    },
    {
        topic: 'Pest and Disease Management',
        content: `Integrated Pest Management (IPM) combines multiple strategies: Cultural (crop rotation, resistant varieties), Biological (natural predators), Chemical (pesticides as last resort). Common pests: Fall armyworm (maize), coffee berry borer, banana weevils. Organic options: Neem extracts, ash, chili spray. Always follow pesticide safety guidelines. Spray early morning or late evening.`,
    },
    {
        topic: 'Weather and Climate',
        content: `Uganda has two rainy seasons: March-May (long rains) and September-November (short rains). Climate varies by region: Lake Victoria basin (high rainfall), Karamoja (semi-arid). Climate change impacts: Unpredictable rainfall, longer dry spells, increased temperatures. Adaptation: Drought-resistant varieties, water harvesting, irrigation, mulching, agroforestry.`,
    },
    {
        topic: 'Fertilizer Application',
        content: `Common fertilizers in Uganda: DAP (Diammonium Phosphate) - high in phosphorus and nitrogen. NPK (Nitrogen, Phosphorus, Potassium) - balanced nutrients. Urea - high nitrogen for top-dressing. Organic options: Compost, animal manure, green manure. Application timing: Base fertilizer at planting, top-dressing 4-6 weeks after emergence. Always apply when soil is moist.`,
    },
    {
        topic: 'Irrigation Methods',
        content: `Irrigation extends growing seasons and increases yields. Methods suitable for Uganda: Drip irrigation (water-efficient, reduces disease), Sprinkler (good for vegetables), Furrow irrigation (traditional, labor-intensive). Water sources: Rivers, boreholes, rainwater harvesting. Small-scale options: Watering cans, buckets with drip holes. Irrigate early morning or evening to reduce evaporation.`,
    },
    {
        topic: 'Post-Harvest Handling',
        content: `Proper post-harvest reduces losses (currently 30-40% in Uganda). Harvesting: Use right maturity stage, avoid damage. Drying: Maize, coffee, beans need proper drying (12-14% moisture). Storage: Use improved stores (metal silos, hermetic bags) to prevent pests. Value addition: Processing increases income (e.g., maize flour, dried fruits). Market timing: Store to sell when prices are high.`,
    },
];

/**
 * Simple RAG implementation using Gemini for agricultural Q&A
 * @param {string} question - Farmer's question
 * @param {Object} options - Additional options (language, location, etc.)
 * @returns {Promise<Object>} AI-generated answer with sources
 */
export async function askAgriculturalQuestion(question, options = {}) {
    try {
        const { language = 'English', location = 'Uganda', cropType = '' } = options;

        // Simple keyword-based retrieval (in production, use vector similarity)
        const relevantKnowledge = agriculturalKnowledge.filter(item => {
            const searchText = `${item.topic} ${item.content}`.toLowerCase();
            const questionWords = question.toLowerCase().split(' ');
            return questionWords.some(word => word.length > 3 && searchText.includes(word));
        });

        // Build context from relevant knowledge
        const context = relevantKnowledge.length > 0
            ? relevantKnowledge.map(item => `${item.topic}:\n${item.content}`).join('\n\n')
            : 'No specific knowledge base match found. Provide general agricultural advice.';

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `You are an expert agricultural advisor for farmers in ${location}.

CONTEXT FROM KNOWLEDGE BASE:
${context}

FARMER'S QUESTION: ${question}

${cropType ? `CROP TYPE: ${cropType}` : ''}

INSTRUCTIONS:
1. Answer in ${language}
2. Provide practical, actionable advice
3. Consider local conditions in ${location}
4. Use simple language suitable for small-scale farmers
5. If the knowledge base doesn't have specific information, use your general agricultural knowledge
6. Include specific recommendations (varieties, timing, quantities) when relevant
7. Mention costs in Ugandan Shillings (UGX) when applicable

Provide a clear, helpful answer:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let answer = response.text();

        // If not English, translate using the backend service
        if (language !== 'English') {
            try {
                const langCodes = {
                    'Luganda': 'lug',
                    'Acholi': 'ach',
                    'Ateso': 'teo',
                    'Lugbara': 'lgg',
                    'Runyankole': 'nyn'
                };
                const targetCode = langCodes[language];
                if (targetCode) {
                    const transRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/auth/translate`, {
                        text: answer,
                        targetLang: targetCode
                    });
                    if (transRes.data && transRes.data.translatedText) {
                        answer = transRes.data.translatedText;
                    }
                }
            } catch (tError) {
                console.error('Translation error in RAG service:', tError);
            }
        }

        return {
            success: true,
            answer,
            sources: relevantKnowledge.map(item => item.topic),
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Detailed RAG Error:', error);
        console.error('API Key Status:', import.meta.env.VITE_GEMINI_API_KEY ? 'Present' : 'Missing');

        // Check for specific error types
        let errorMessage = 'Sorry, I could not process your question at this time.';

        if (error.message.includes('API key')) {
            errorMessage = 'Configuration Error: Invalid or missing API key. Please check your settings.';
        } else if (error.message.includes('quota') || error.status === 429) {
            errorMessage = 'System Busy: We are experiencing high traffic. Please try again in a minute.';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
            errorMessage = 'Connection Error: Please check your internet connection.';
        }

        return {
            success: false,
            error: error.message || 'Failed to process question',
            answer: `${errorMessage} (Debug: ${error.message})`,
            sources: [],
        };
    }
}

/**
 * Get farming recommendations based on season and location
 * @param {Object} params - Season, location, and other parameters
 * @returns {Promise<Object>} Seasonal recommendations
 */
export async function getSeasonalRecommendations(params = {}) {
    try {
        const { month = new Date().getMonth() + 1, region = 'Central Uganda', farmSize = 'small-scale' } = params;

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `You are an agricultural advisor for ${region}.

Current Month: ${month}
Farm Size: ${farmSize}

Provide seasonal farming recommendations including:
1. What crops to plant this month
2. Ongoing crop management activities
3. Harvesting activities
4. Weather considerations
5. Pest and disease alerts for this season

Format your response as practical, actionable advice for farmers.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recommendations = response.text();

        return {
            success: true,
            recommendations,
            month,
            region,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error getting seasonal recommendations:', error);
        return {
            success: false,
            error: error.message || 'Failed to get recommendations',
        };
    }
}

/**
 * Analyze uploaded agricultural document
 * @param {string} documentText - Extracted text from uploaded document
 * @param {string} question - Question about the document
 * @returns {Promise<Object>} Answer based on document
 */
export async function analyzeDocument(documentText, question) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `You are an agricultural document analyst.

DOCUMENT CONTENT:
${documentText.substring(0, 10000)} // Limit to first 10k characters

QUESTION: ${question}

Analyze the document and answer the question based on the information provided. If the answer is not in the document, say so clearly.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        return {
            success: true,
            answer,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error analyzing document:', error);
        return {
            success: false,
            error: error.message || 'Failed to analyze document',
            answer: 'Could not analyze the document. Please try again.',
        };
    }
}

/**
 * Get crop-specific advice
 * @param {string} cropName - Name of the crop
 * @param {string} issue - Specific issue or question
 * @returns {Promise<Object>} Crop-specific advice
 */
export async function getCropAdvice(cropName, issue) {
    try {
        // Find relevant knowledge
        const relevantInfo = agriculturalKnowledge.find(item =>
            item.topic.toLowerCase().includes(cropName.toLowerCase())
        );

        const context = relevantInfo ? relevantInfo.content : '';

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a crop specialist for ${cropName} in Uganda.

${context ? `KNOWLEDGE BASE:\n${context}\n\n` : ''}

FARMER'S ISSUE: ${issue}

Provide specific, actionable advice for this ${cropName} issue. Include:
1. Diagnosis of the problem
2. Immediate actions to take
3. Long-term solutions
4. Prevention strategies
5. Estimated costs in UGX if applicable

Keep advice practical for small-scale farmers.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const advice = response.text();

        return {
            success: true,
            advice,
            cropName,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error getting crop advice:', error);
        return {
            success: false,
            error: error.message || 'Failed to get crop advice',
            advice: 'Could not provide advice at this time. Please try again.',
        };
    }
}

export default {
    askAgriculturalQuestion,
    getSeasonalRecommendations,
    analyzeDocument,
    getCropAdvice,
};
