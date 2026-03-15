import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Minus, Send, Sparkles, User, ChevronRight, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import OmaraAISuggestedQuestions from './OmaraAISuggestedQuestions';
import { generateAIResponse } from '@/services/OmaraAIResponseService';

const OmaraAIFixed = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Load history
    useEffect(() => {
        const savedHistory = localStorage.getItem('omara_chat_history');
        if (savedHistory) {
            try {
                setMessages(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse chat history");
            }
        } else {
            // Initial welcome message
            setMessages([{
                id: 'welcome',
                text: "Hi there! I'm Omara, your AI assistant. How can I help you manage your business today?",
                sender: 'ai',
                timestamp: new Date().toISOString()
            }]);
        }
    }, []);

    // Save history
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('omara_chat_history', JSON.stringify(messages.slice(-50))); // Keep last 50
        }
    }, [messages]);

    // Auto-scroll
    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isMinimized]);

    const handleSendMessage = async (text) => {
        const messageText = text || inputValue;
        if (!messageText.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await generateAIResponse(messageText, location.pathname);
            
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                sender: 'ai',
                timestamp: new Date().toISOString(),
                actions: response.actions
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date().toISOString(),
                isError: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleClearHistory = () => {
        const welcomeMsg = {
            id: 'welcome-' + Date.now(),
            text: "Chat history cleared. How can I help you now?",
            sender: 'ai',
            timestamp: new Date().toISOString()
        };
        setMessages([welcomeMsg]);
        localStorage.removeItem('omara_chat_history');
    };

    const handleActionClick = (link) => {
        navigate(link);
        if (window.innerWidth < 768) {
            setIsMinimized(true);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-[9990]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                data-tour="omara-ai-trigger"
            >
                {!isOpen && (
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-0 relative overflow-hidden group"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, repeatDelay: 2 }}
                        >
                            <Sparkles className="h-6 w-6" />
                        </motion.div>
                        <span className="sr-only">Open Omara AI</span>
                        {/* Pulse effect */}
                        <span className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-20" />
                    </Button>
                )}
            </motion.div>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ 
                            opacity: 1, 
                            y: isMinimized ? 0 : 0, 
                            scale: 1,
                            height: isMinimized ? 'auto' : '600px',
                            width: isMinimized ? '320px' : '400px'
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className={cn(
                            "fixed right-4 z-[9999] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col transition-all duration-300",
                            isMinimized ? "bottom-4" : "bottom-4 md:bottom-6 max-h-[85vh] w-[90vw] md:w-[400px]"
                        )}
                    >
                        {/* Header */}
                        <div 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => setIsMinimized(!isMinimized)}
                        >
                            <div className="flex items-center gap-3 text-white">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Omara AI</h3>
                                    {!isMinimized && <p className="text-[10px] text-blue-100 opacity-90">Always here to help</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-white/80">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                                    className="p-1 hover:bg-white/10 rounded"
                                >
                                    <Minus size={18} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                    className="p-1 hover:bg-white/10 rounded"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        {!isMinimized && (
                            <>
                                <div className="flex-1 overflow-hidden relative bg-gray-50 dark:bg-gray-950/50">
                                    <ScrollArea className="h-full px-4 py-4">
                                        <div className="space-y-4 pb-4">
                                            {messages.map((msg) => (
                                                <div 
                                                    key={msg.id} 
                                                    className={cn(
                                                        "flex gap-3 max-w-[85%]",
                                                        msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                                    )}
                                                >
                                                    <Avatar className="h-8 w-8 mt-1 border">
                                                        <AvatarImage src={msg.sender === 'user' ? "" : "/omara-logo-small.png"} />
                                                        <AvatarFallback className={msg.sender === 'user' ? "bg-gray-200" : "bg-blue-100 text-blue-600"}>
                                                            {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <div 
                                                            className={cn(
                                                                "p-3 rounded-2xl text-sm shadow-sm",
                                                                msg.sender === 'user' 
                                                                    ? "bg-blue-600 text-white rounded-tr-none" 
                                                                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-none"
                                                            )}
                                                        >
                                                            {msg.text}
                                                        </div>
                                                        
                                                        {msg.actions && (
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {msg.actions.map((action, idx) => (
                                                                    <Button 
                                                                        key={idx}
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        className="h-7 text-xs gap-1 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700"
                                                                        onClick={() => handleActionClick(action.link)}
                                                                    >
                                                                        {action.label} <ChevronRight size={10} />
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        )}
                                                        
                                                        <div className={cn("text-[10px] text-gray-400 px-1", msg.sender === 'user' && "text-right")}>
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {isTyping && (
                                                <div className="flex gap-3 max-w-[80%]">
                                                    <Avatar className="h-8 w-8 mt-1 border">
                                                        <AvatarFallback className="bg-blue-100 text-blue-600"><Sparkles size={14} /></AvatarFallback>
                                                    </Avatar>
                                                    <div className="bg-white dark:bg-gray-800 border p-3 rounded-2xl rounded-tl-none flex gap-1 items-center h-10">
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Footer / Input */}
                                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                                    <OmaraAISuggestedQuestions onSelect={handleSendMessage} />
                                    
                                    <div className="flex gap-2 mt-3">
                                        <div className="relative flex-1">
                                            <Input
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Ask Omara anything..."
                                                className="pr-10"
                                            />
                                        </div>
                                        <Button 
                                            size="icon" 
                                            className="shrink-0 bg-blue-600 hover:bg-blue-700"
                                            onClick={() => handleSendMessage()}
                                            disabled={!inputValue.trim() || isTyping}
                                        >
                                            <Send size={18} />
                                        </Button>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[10px] text-muted-foreground">AI can make mistakes. Verify important info.</span>
                                        <button 
                                            onClick={handleClearHistory}
                                            className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                                            title="Clear Chat History"
                                        >
                                            <Trash2 size={10} /> Clear
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default OmaraAIFixed;