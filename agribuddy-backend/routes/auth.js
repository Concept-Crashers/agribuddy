const express = require('express');
const { 
    register, 
    login, 
    getMe,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.get('/me', protect, getMe);

const languageService = require('../services/languageService');
router.post('/translate', async (req, res) => {
    const { text, targetLang, sourceLang = 'eng' } = req.body;
    try {
        const translatedText = await languageService.translateText(text, sourceLang, targetLang);
        res.status(200).json({ success: true, translatedText });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
