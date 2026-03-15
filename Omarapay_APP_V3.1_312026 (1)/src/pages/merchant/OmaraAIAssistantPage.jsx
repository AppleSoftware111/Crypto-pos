import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Trash2, ArrowUp, Info } from 'lucide-react';
import { useOmaraAIChat } from '@/context/OmaraAIChatContext';
import OmaraAIChatMessage from '@/components/merchant/OmaraAIChatMessage';
import OmaraAIQuickPrompts from '@/components/merchant/OmaraAIQuickPrompts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';

// Refactor: We don't import Layout here if we route it inside UserWalletLayout in App.jsx
// However, if we need full height behavior different from StandardPageWrapper, we might adjust.
// StandardPageWrapper adds padding and container, which is good.

const OmaraAIAssistantPage = () => {
  const { messages, isLoading, addMessage, clearHistory } = useOmaraAIChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const msg = inputValue;
    setInputValue('');
    await addMessage(msg);
  };

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  return (
    <StandardPageWrapper className="h-[calc(100vh-4rem)] flex flex-col p-0 md:p-0 overflow-hidden !bg-transparent !container-none !px-0">
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 rounded-none md:rounded-2xl overflow-hidden shadow-2xl relative border border-gray-200 dark:border-gray-800">
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/95 dark:bg-slate-950/95 backdrop-blur z-20">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-ai-gradient rounded-lg text-white">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg bg-ai-gradient bg-clip-text text-transparent">Omara AI</h2>
                        <p className="text-xs text-gray-600">Enterprise Assistant</p> {/* Secondary text medium grey */}
                    </div>
                </div>
                {messages.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 size={16} className="mr-2" /> Clear
                    </Button>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-touch bg-slate-50 dark:bg-slate-900/50">
                {messages.length <= 1 && (
                     <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-90"> {/* Increased opacity for better visibility */}
                         <div className="w-16 h-16 bg-blue-100 dark:bg-ai-gradient rounded-full flex items-center justify-center mb-4"> {/* Brighter background for icon */}
                            <Sparkles className="w-8 h-8 text-primary dark:text-white" /> {/* Primary color for icon */}
                         </div>
                         <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">How can I help you today?</h3> {/* 2xl-3xl, bold, deep midnight blue */}
                         <p className="text-base lg:text-lg text-gray-700 font-medium max-w-md mb-8"> {/* base-lg, darker grey, medium font */}
                             I can help you analyze transactions, check compliance status, or draft support responses.
                         </p>
                         <OmaraAIQuickPrompts onSelect={handleQuickPrompt} />
                     </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <OmaraAIChatMessage key={msg.id} message={msg} />
                    ))}
                </AnimatePresence>
                
                {isLoading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-ai-gradient flex items-center justify-center text-white text-xs">AI</div>
                         <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                             <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                             <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                             <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                         </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-gray-800 z-20">
                <form onSubmit={handleSubmit} className="relative flex items-end gap-2 max-w-4xl mx-auto">
                    <div className="relative flex-1 bg-gray-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-transparent focus-within:border-indigo-500 transition-colors">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full bg-transparent border-none p-3.5 focus:ring-0 text-gray-800 dark:text-gray-100 font-medium placeholder-gray-500" // Darker text, font-medium, better placeholder contrast
                            disabled={isLoading}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        size="icon" 
                        className={cn("h-[46px] w-[46px] rounded-xl shrink-0 transition-all", inputValue.trim() ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 dark:bg-slate-800")}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        {isLoading ? <Sparkles className="w-5 h-5 animate-pulse" /> : <ArrowUp className="w-5 h-5" />}
                    </Button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600 flex items-center justify-center gap-1"> {/* Medium grey */}
                        <Info size={10} /> AI responses may vary. Verify important financial data.
                    </p>
                </div>
            </div>

        </div>
    </StandardPageWrapper>
  );
};

export default OmaraAIAssistantPage;