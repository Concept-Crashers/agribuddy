import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInterface = ({ onSendMessage, messages, isLoading }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue.trim());
            setInputValue('');
            inputRef.current?.focus();
        }
    };

    const quickQuestions = [
        'When should I plant maize?',
        'How do I treat coffee leaf rust?',
        'What fertilizer for cassava?',
        'Best banana varieties for Uganda',
    ];

    const handleQuickQuestion = (question) => {
        if (!isLoading) {
            onSendMessage(question);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="MessageSquare" size={32} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            Welcome to AgriBuddy Assistant
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Ask me anything about farming in Uganda. I can help with crop advice, pest management, weather tips, and more!
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                            {quickQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickQuestion(question)}
                                    className="p-3 text-left bg-card border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-sm"
                                >
                                    <Icon name="HelpCircle" size={16} className="inline mr-2 text-primary" />
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3 sm:p-4 ${message.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-card border border-border'
                                        }`}
                                >
                                    <div className="flex items-start space-x-2">
                                        {message.role === 'assistant' && (
                                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <Icon name="Bot" size={14} className="text-primary" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm whitespace-pre-wrap break-words">
                                                {message.content}
                                            </p>
                                            {message.sources && message.sources.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-border/50">
                                                    <p className="text-xs text-muted-foreground mb-1">Sources:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {message.sources.map((source, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                                                            >
                                                                {source}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <p className="text-xs opacity-60 mt-1">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        {message.role === 'user' && (
                                            <div className="w-6 h-6 bg-primary-foreground/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <Icon name="User" size={14} className="text-primary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] sm:max-w-[75%] rounded-lg p-3 sm:p-4 bg-card border border-border">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Icon name="Bot" size={14} className="text-primary" />
                                        </div>
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4 bg-card">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about farming, crops, pests, weather..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    />
                    <Button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="px-6"
                    >
                        <Icon name="Send" size={18} />
                    </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    AI-powered agricultural advice for Ugandan farmers
                </p>
            </div>
        </div>
    );
};

export default ChatInterface;
