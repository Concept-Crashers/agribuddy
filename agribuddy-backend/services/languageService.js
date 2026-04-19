const axios = require('axios');

/**
 * Service for local language translation and AI tasks via Sunbird AI
 */
class LanguageService {
    constructor() {
        this.apiKey = process.env.SUNBIRD_API_KEY;
        this.baseUrl = 'https://api.sunbird.ai';
    }

    /**
     * Translate text between English and local Ugandan languages
     * @param {string} text - The text to translate
     * @param {string} sourceLang - Code (eng, lug, ach, teo, lgg, nyn)
     * @param {string} targetLang - Code (eng, lug, ach, teo, lgg, nyn)
     */
    async translateText(text, sourceLang = 'eng', targetLang = 'lug') {
        if (!text || sourceLang === targetLang) return text;

        try {
            const response = await axios.post(
                `${this.baseUrl}/tasks/translate`,
                {
                    source_language: sourceLang,
                    target_language: targetLang,
                    text: text
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.output && response.data.output.translated_text) {
                return response.data.output.translated_text;
            }
            
            // Fallback to legacy structure if output.text is used
            if (response.data && response.data.output && response.data.output.text) {
                return response.data.output.text;
            }

            return text; // Fallback to original text if translation failure
        } catch (error) {
            console.error('Sunbird Translation Error:', error.response?.data || error.message);
            return text; // Fallback to original text
        }
    }

    /**
     * Get Sunflower AI inference (native local language AI)
     * @param {string} instruction - The user's question or instruction
     */
    async getSunflowerAdvice(instruction) {
        try {
            // Using the sunflower_simple endpoint for single advice
            const response = await axios.post(
                `${this.baseUrl}/tasks/sunflower_simple`,
                new URLSearchParams({
                    instruction: instruction,
                    model_type: 'qwen',
                    temperature: '0.3'
                }),
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data && response.data.response) {
                return response.data.response;
            }
            return null;
        } catch (error) {
            console.error('Sunflower AI Error:', error.response?.data || error.message);
            return null;
        }
    }
}

module.exports = new LanguageService();
