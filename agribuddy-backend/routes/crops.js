const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const CropKnowledge = require('../models/CropKnowledge');
const ChatHistory = require('../models/ChatHistory');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ──────────────────────────────────────────────
// GET /api/crops  – list / search all crops
// ──────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { q, category, region, limit = 20, page = 1 } = req.query;
        const query = {};

        if (q) {
            query.$text = { $search: q };
        }
        if (category) query.category = category;
        if (region) query.regions = region;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const crops = await CropKnowledge.find(query)
            .select('name localName scientificName category description growingConditions marketValue regions imageUrl')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ name: 1 });

        const total = await CropKnowledge.countDocuments(query);

        res.json({ success: true, data: crops, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
        console.error('Error fetching crops:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ──────────────────────────────────────────────
// GET /api/crops/:id  – single crop detail
// ──────────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const crop = await CropKnowledge.findById(req.params.id);
        if (!crop) return res.status(404).json({ success: false, error: 'Crop not found' });
        res.json({ success: true, data: crop });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ──────────────────────────────────────────────
// POST /api/crops/chat  –  AI advisory chatbot with RAG
// ──────────────────────────────────────────────
router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId, cropName } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        // Fetch relevant crop knowledge from DB as RAG context
        let cropContext = '';
        const searchQuery = cropName ? { name: new RegExp(cropName, 'i') } : { $text: { $search: message } };

        try {
            const relevantCrops = await CropKnowledge.find(searchQuery).limit(3);
            if (relevantCrops.length > 0) {
                cropContext = relevantCrops.map(c =>
                    `Crop: ${c.name} (${c.localName || ''})\n` +
                    `Description: ${c.description}\n` +
                    `Growing Conditions: ${JSON.stringify(c.growingConditions)}\n` +
                    `Common Diseases: ${c.commonDiseases.map(d => d.name).join(', ')}\n` +
                    `Market Value: ${c.marketValue}\n`
                ).join('\n---\n');
            }
        } catch (dbErr) {
            // DB search may fail if no text index; fall back gracefully
        }

        // Retrieve chat history for this session
        let session = await ChatHistory.findOne({ sessionId });
        if (!session) {
            session = new ChatHistory({ sessionId, cropContext: cropName });
        }

        // Build conversation history for Gemini
        const conversationHistory = session.messages.slice(-10).map(m => ({
            role: m.role,
            parts: [{ text: m.content }],
        }));

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemInstruction = `You are AgriBot, an expert agricultural advisor for small-scale farmers in Uganda East Africa.

Your knowledge base includes information about crops grown in Uganda.
${cropContext ? `\n## Relevant Crop Knowledge:\n${cropContext}` : ''}

Guidelines:
- Give practical, actionable advice suited for small-scale Ugandan farmers
- Mention affordable, locally available inputs and practices
- Consider seasonal patterns of Uganda (two rainy seasons: March–May and Sept–Nov)
- Use simple, clear language
- Keep responses concise (under 200 words unless asked for detail)
- If you don't know something specific, recommend contacting a local extension officer`;

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemInstruction }] },
                { role: 'model', parts: [{ text: 'I understand. I am AgriBot, ready to help Ugandan farmers with agricultural advice.' }] },
                ...conversationHistory,
            ],
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        // Persist messages
        session.messages.push({ role: 'user', content: message });
        session.messages.push({ role: 'assistant', content: responseText });
        await session.save();

        res.json({
            success: true,
            reply: responseText,
            sessionId: session.sessionId,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error in chatbot:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get response',
            reply: 'Sorry, I am temporarily unavailable. Please try again or contact your local extension officer.',
        });
    }
});

// ──────────────────────────────────────────────
// GET /api/crops/chat/history/:sessionId
// ──────────────────────────────────────────────
router.get('/chat/history/:sessionId', async (req, res) => {
    try {
        const session = await ChatHistory.findOne({ sessionId: req.params.sessionId });
        if (!session) return res.json({ success: true, messages: [] });
        res.json({ success: true, messages: session.messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ──────────────────────────────────────────────
// POST /api/crops  –  admin: add a crop (simple)
// ──────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const crop = new CropKnowledge(req.body);
        await crop.save();
        res.status(201).json({ success: true, data: crop });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;
