// Backend API URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Analyze plant image for disease detection using Gemini Vision on the backend
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @returns {Promise<Object>} Analysis results with disease info, treatments, and prevention tips
 */
export async function analyzePlantDisease(imageDataUrl) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/diagnosis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageDataUrl }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
             throw new Error(result.error || 'API returned an error');
        }

        return result;
    } catch (error) {
        console.error('Error analyzing plant disease via API:', error);

        // Return user-friendly error
        return {
            success: false,
            error: error.message || 'Failed to analyze image',
            fallback: {
                disease: 'Analysis Failed',
                cropType: 'Unknown',
                confidence: 0,
                description: 'Unable to connect to the analysis service. Please check your internet connection and try again.',
                treatments: [],
                preventionTips: ['Ensure good image quality', 'Take photos in good lighting', 'Focus on affected plant parts'],
                severity: 'unknown',
                urgency: 'Please retry analysis',
                additionalNotes: 'If the problem persists, please contact agricultural extension services.',
            },
        };
    }
}

/**
 * Generate agricultural advice using Gemini on the backend
 * @param {string} question - Farmer's question
 * @param {string} context - Additional context (crop type, location, etc.)
 * @returns {Promise<Object>} AI-generated advice
 */
export async function getAgriculturalAdvice(question, context = '') {
    try {
        const response = await fetch(`${BACKEND_URL}/api/diagnosis/advice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question, context }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
             throw new Error(result.error || 'API returned an error');
        }

        return result;
    } catch (error) {
        console.error('Error getting agricultural advice via API:', error);
        return {
            success: false,
            error: error.message || 'Failed to get advice',
            answer: 'Sorry, I could not process your question at this time. Please try again or contact an agricultural extension officer.',
        };
    }
}

/**
 * Analyze multiple images for comparison on the backend
 * @param {Array<string>} imageDataUrls - Array of base64 encoded image data URLs
 * @returns {Promise<Object>} Comparative analysis
 */
export async function compareMultiplePlants(imageDataUrls) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/diagnosis/compare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageDataUrls }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
             throw new Error(result.error || 'API returned an error');
        }

        return result;
    } catch (error) {
        console.error('Error comparing plants via API:', error);
        return {
            success: false,
            error: error.message || 'Failed to compare images',
        };
    }
}

export default {
    analyzePlantDisease,
    getAgriculturalAdvice,
    compareMultiplePlants,
};
