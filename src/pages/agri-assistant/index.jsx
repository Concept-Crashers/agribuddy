import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ChatInterface from './components/ChatInterface';
import VoiceAssistant from '../../components/VoiceAssistant';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { askAgriculturalQuestion } from '../../services/ragService';

const AgriAssistant = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768;
            const largeScreen = window.innerWidth >= 1024;
            setIsMobile(mobile);
            setSidebarExpanded(largeScreen);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleSendMessage = async (messageText) => {
        const userMessage = {
            role: 'user',
            content: messageText,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const result = await askAgriculturalQuestion(messageText, {
                language: 'English',
                location: 'Uganda',
            });

            const assistantMessage = {
                role: 'assistant',
                content: result.answer,
                sources: result.sources || [],
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error getting response:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again or contact support.',
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        if (window.confirm('Clear all messages?')) {
            setMessages([]);
        }
    };

    const suggestedQuestions = [
        { text: 'When is the best time to plant maize?', icon: 'Sprout' },
        { text: 'How to cure banana wilt disease?', icon: 'Bug' },
        { text: 'Current price of beans in Kampala?', icon: 'TrendingUp' },
        { text: 'What is the ideal NPK ratio for coffee?', icon: 'Leaf' }
    ];

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <Header
                onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
                sidebarExpanded={sidebarExpanded}
                userRole="farmer"
            />
            <Sidebar
                isExpanded={sidebarExpanded}
                onToggle={() => setSidebarExpanded(!sidebarExpanded)}
                userRole="farmer"
            />
            <main className={`transition-all duration-300 ${isMobile ? 'ml-0 pb-20' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'} pt-16`}>
                <div className="p-4 sm:p-6 lg:p-8 max-w-8xl mx-auto h-[calc(100vh-64px)] flex flex-col">
                    <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden min-h-0">
                        {/* LEFT: Chat Area (70%) */}
                        <div className="flex-1 lg:w-2/3 rounded-2xl border border-white/20 shadow-organic-lg bg-white/60 backdrop-blur-xl flex flex-col overflow-hidden relative">
                            {/* Glassmorphic Header */}
                            <div className="px-6 py-4 flex justify-between items-center border-b border-border/50 bg-white/40 backdrop-blur-md z-10">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Icon name="Bot" size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">AskBuddy AI</h2>
                                        <p className="text-xs font-medium text-muted-foreground">Your Farming Assistant</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearChat}
                                    className="border-muted hover:bg-muted font-medium text-sm rounded-lg"
                                >
                                    <Icon name="Trash2" size={16} className="mr-2" />
                                    Clear Chat
                                </Button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-6 z-0">
                                <ChatInterface
                                    messages={messages}
                                    onSendMessage={handleSendMessage}
                                    isLoading={isLoading}
                                />
                            </div>

                            {/* Custom Input Placeholder - this should ideally wrap the ChatInterface input or replace it if ChatInterface only renders messages. 
                                Assuming ChatInterface handles input for now, but to ensure Stitch design accuracy, we wrap it in a sleek container. */}
                        </div>

                        {/* RIGHT: Suggested Questions (30%) */}
                        <div className="hidden lg:flex flex-col lg:w-1/3 w-full bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm overflow-y-auto">
                            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                                <Icon name="Sparkles" size={20} className="text-accent" />
                                Suggested Questions
                            </h3>
                            <div className="flex flex-col gap-3">
                                {suggestedQuestions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(q.text)}
                                        className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-organic-md transition-all text-left"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                                            <Icon name={q.icon} size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mt-1 leading-snug">
                                            {q.text}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-auto pt-8">
                                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon name="Mic" size={16} className="text-primary" />
                                        <span className="text-sm font-semibold text-foreground">Try Voice Input</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Tap the microphone icon in the chat input below to speak directly to AskBuddy in English, Luganda, or Runyankole.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <VoiceAssistant
                onResponse={(message) => {
                    setMessages(prev => [...prev, {
                        ...message,
                        timestamp: new Date().toISOString()
                    }]);
                }}
            />
        </div>
    );
};

export default AgriAssistant;
