const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze plant image for disease detection
router.post('/', async (req, res) => {
    try {
        const { imageDataUrl } = req.body;
        if (!imageDataUrl) {
            return res.status(400).json({ success: false, error: 'No image data provided' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const base64Data = imageDataUrl.split(',')[1];
        const mimeType = imageDataUrl.split(';')[0].split(':')[1];

        const prompt = `You are an expert agricultural pathologist specializing in plant diseases in Uganda and East Africa.

Analyze this plant image and provide a detailed diagnosis in JSON format.

IMPORTANT INSTRUCTIONS:
1. Identify the crop type (e.g., Coffee, Maize, Cassava, Banana, etc.)
2. Detect any visible diseases, pests, or health issues
3. If the plant appears healthy, indicate that clearly
4. Provide confidence score (0-100%)
5. Give practical treatment recommendations available in Uganda
6. Include prevention tips suitable for small-scale farmers

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "disease": "Disease name or 'Healthy' if no disease detected",
  "cropType": "Identified crop species",
  "confidence": 85,
  "description": "Detailed description of the condition, symptoms, and causes",
  "treatments": [
    {
      "type": "organic",
      "name": "Treatment name",
      "availability": "Where to find in Uganda",
      "instructions": "Step-by-step application instructions",
      "dosage": "Recommended dosage",
      "timing": "When and how often to apply",
      "cost": "Estimated cost in UGX"
    }
  ],
  "preventionTips": [
    "Prevention tip 1",
    "Prevention tip 2",
    "Prevention tip 3"
  ],
  "severity": "low|medium|high",
  "urgency": "Immediate action needed or can wait",
  "additionalNotes": "Any other important information for the farmer"
}`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        let analysisData;
        try {
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text);
            return res.status(500).json({ success: false, error: 'Invalid response format from AI model' });
        }

        res.json({
            success: true,
            data: analysisData,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error analyzing plant disease:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze image',
            fallback: {
                disease: 'Analysis Failed',
                cropType: 'Unknown',
                confidence: 0,
                description: 'Unable to analyze the image. Please ensure the image is clear and shows the plant clearly. Try again or contact support.',
                treatments: [],
                preventionTips: ['Ensure good image quality', 'Take photos in good lighting', 'Focus on affected plant parts'],
                severity: 'unknown',
                urgency: 'Please retry analysis',
                additionalNotes: 'If the problem persists, please contact agricultural extension services.',
            },
        });
    }
});

// Generate agricultural advice
router.post('/advice', async (req, res) => {
    try {
        const { question, context } = req.body;
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `You are an agricultural expert specializing in Ugandan farming practices.

Context: ${context || ''}

Farmer's Question: ${question}

Provide practical, actionable advice suitable for small-scale farmers in Uganda. Consider:
- Local climate and conditions
- Affordable solutions
- Traditional and modern practices
- Sustainability
- Local crop varieties

Keep your response clear, concise, and practical.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            answer: text,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error getting agricultural advice:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get advice',
            answer: 'Sorry, I could not process your question at this time. Please try again or contact an agricultural extension officer.',
        });
    }
});

// Compare multiple plants
router.post('/compare', async (req, res) => {
    try {
        const { imageDataUrls } = req.body;
        if (!imageDataUrls || !Array.isArray(imageDataUrls)) {
            return res.status(400).json({ success: false, error: 'No image data URLs provided' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const imageParts = imageDataUrls.map(dataUrl => {
            const base64Data = dataUrl.split(',')[1];
            const mimeType = dataUrl.split(';')[0].split(':')[1];
            return {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            };
        });

        const prompt = `Compare these plant images and identify:
1. Are they the same crop type?
2. Which plants show disease symptoms?
3. What are the differences in health status?
4. Recommendations for the farmer

Provide a comparative analysis in clear, simple language.`;

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            comparison: text,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error comparing plants:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to compare images',
        });
    }
});

module.exports = router;
