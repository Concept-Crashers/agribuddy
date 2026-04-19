import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Icon from '../AppIcon';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageToggle = () => {
    const { currentLanguage, setCurrentLanguage, languages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const activeLang = languages.find(l => l.code === currentLanguage) || languages[0];

    const handleSelect = (code) => {
        setCurrentLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-border bg-white/50 backdrop-blur-sm hover:bg-white transition-all shadow-sm"
            >
                <span className="text-lg">{activeLang.flag}</span>
                <span className="text-sm font-semibold uppercase hidden sm:inline">{activeLang.code}</span>
                <Icon name="ChevronDown" size={14} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-white shadow-organic-lg py-2 z-50 overflow-hidden"
                        >
                            <div className="px-3 py-1.5 mb-1 border-b border-border/50">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Select Language</span>
                            </div>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleSelect(lang.code)}
                                    className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted ${
                                        currentLanguage === lang.code ? 'bg-primary/5 text-primary font-semibold' : 'text-foreground'
                                    }`}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                    {currentLanguage === lang.code && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageToggle;
