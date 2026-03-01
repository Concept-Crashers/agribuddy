import React, { useState, useEffect, useRef } from 'react';
import Icon from "./AppIcon";
import Button from './ui/Button';
import { askAgriculturalQuestion } from '../services/ragService';

/**
 * VoiceAssistant Component
 * Provides a voice interface for the application using Web Speech API
 */
const VoiceAssistant = ({ onResponse }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [supported, setSupported] = useState(true);

    const [language, setLanguage] = useState('en-US'); // 'en-US' or 'lg-UG' (Luganda fallback)

    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language;
        }
    }, [language]);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = language; // Default to English, can fetch user pref

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onresult = async (event) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                handleVoiceQuery(text);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };
        } else {
            setSupported(false);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthesisRef.current) {
                synthesisRef.current.cancel();
            }
        };
    }, []);

    const handleVoiceQuery = async (text) => {
        try {
            // Add user message if parent callback provided
            if (onResponse) {
                onResponse({ role: 'user', content: text, type: 'voice' });
            }

            // Map language code to name
            const langName = language === 'en-US' ? 'English' : 'Luganda';

            // Get answer from Gemini
            const result = await askAgriculturalQuestion(text, { language: langName, location: 'Uganda' });

            if (onResponse) {
                onResponse({ role: 'assistant', content: result.answer, sources: result.sources, type: 'voice' });
            }

            // Speak the answer
            speakResponse(result.answer);
        } catch (error) {
            console.error('Error processing voice query:', error);
            speakResponse("Sorry, I couldn't understand that. Please try again.");
        }
    };

    const speakResponse = (text) => {
        if (synthesisRef.current) {
            // Cancel any ongoing speech
            synthesisRef.current.cancel();

            // Clean text (remove formatting like *, #, etc for better speech)
            const cleanText = text.replace(/[*#_]/g, '').substring(0, 200); // Limit length for demo

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            synthesisRef.current.speak(utterance);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const stopSpeaking = () => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    if (!supported) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
            {/* Transcript Visualization when active */}
            {(isListening || isSpeaking) && (
                <div className="bg-card border border-border rounded-lg p-3 shadow-organic-lg mb-2 max-w-xs animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-primary'}`}></div>
                        <span className="text-xs font-medium text-muted-foreground">
                            {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
                        </span>
                    </div>
                    {transcript && isListening && (
                        <p className="text-sm text-foreground italic">"{transcript}"</p>
                    )}
                </div>
            )}

            <div className="flex space-x-2 items-center">
                {/* Language Toggle */}
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-card shadow-organic-sm text-xs font-medium h-8 px-2"
                    onClick={() => setLanguage(prev => prev === 'en-US' ? 'lg-UG' : 'en-US')}
                    title="Switch Language"
                >
                    {language === 'en-US' ? 'EN' : 'LG'}
                </Button>

                {isSpeaking && (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full h-12 w-12 shadow-organic-lg"
                        onClick={stopSpeaking}
                        title="Stop speaking"
                    >
                        <Icon name="VolumeX" size={24} />
                    </Button>
                )}

                <Button
                    variant={isListening ? "destructive" : "default"}
                    size="icon"
                    className={`rounded-full h-14 w-14 shadow-organic-lg transition-all duration-300 ${isListening ? 'scale-110 ring-4 ring-destructive/20' : 'hover:scale-105'}`}
                    onClick={toggleListening}
                    title={isListening ? "Stop listening" : "Ask AgriBuddy"}
                >
                    <Icon name={isListening ? "MicOff" : "Mic"} size={28} />
                </Button>
            </div>
        </div>
    );
};

export default VoiceAssistant;
