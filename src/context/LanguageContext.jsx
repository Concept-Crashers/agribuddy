import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { locales } from '../utils/locales';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const languages = [
    { code: 'eng', name: 'English', flag: '🇺🇸' },
    { code: 'lug', name: 'Luganda', flag: '🇺🇬' },
    { code: 'ach', name: 'Acholi', flag: '🇺🇬' },
    { code: 'teo', name: 'Ateso', flag: '🇺🇬' },
    { code: 'lgg', name: 'Lugbara', flag: '🇺🇬' },
    { code: 'nyn', name: 'Runyankole', flag: '🇺🇬' },
];

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        return localStorage.getItem('agribuddy_language') || 'eng';
    });
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        localStorage.setItem('agribuddy_language', currentLanguage);
        // Sync with backend if user is logged in (optional, but good for persistence)
    }, [currentLanguage]);

    const t = (key, defaultValue = '') => {
        // This is a simple translation function that will look up keys in a locale file
        // For dynamic content, we'll use the translateText API via the backend
        return locales[currentLanguage]?.[key] || defaultValue || key;
    };

    /**
     * Translate dynamic text using the backend Sunbird AI service
     */
    const translateDynamic = async (text) => {
        if (currentLanguage === 'eng' || !text) return text;

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/auth/translate`, {
                text,
                targetLang: currentLanguage
            });
            return response.data.translatedText || text;
        } catch (error) {
            console.error('Dynamic translation error:', error);
            return text;
        }
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, languages, t, translateDynamic }}>
            {children}
        </LanguageContext.Provider>
    );
};
