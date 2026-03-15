import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Trash2, ArrowUp, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PublicOmaraAIChatMessage from '@/components/public/PublicOmaraAIChatMessage';
import PublicOmaraAIQuickPrompts from '@/components/public/PublicOmaraAIQuickPrompts';
import { usePublicOmaraAI } from '@/context/PublicOmaraAIContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CTACard = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="relative w-full max-w-2xl mx-auto my-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 backdrop-blur-xl shadow-2xl"
  >
    <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors">
      <X size={16} />
    </button>
    <div className="flex items-start gap-4">
      <div className="p-3 bg-indigo-500/20 rounded-xl">
        <CheckCircle2 className="w-6 h-6 text-indigo-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Ready to get started with Omara?</h3>
        <p className="text-sm text-gray-300 mb-4">
          Create an account today to access powerful payment tools, compliance solutions, and dedicated support.
        </p>
        <div className="flex gap-3">
          <Link to="/register">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">Sign Up Now</Button>
          </Link>
          <Link to="/services">
            <Button size="sm" variant="outline" className="border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300">Learn More</Button>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

const PublicOmaraAIPage = () => {
  const { messages, isLoading, addMessage, clearHistory, aiResponseCount, getRemaining } = usePublicOmaraAI();
  const [inputValue, setInputValue] = useState('');
  const [showCTA, setShowCTA] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const remaining = getRemaining();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, showCTA]);

  useEffect(() => {
    // Show CTA after every 3rd AI response
    if (aiResponseCount > 0 && aiResponseCount % 3 === 0) {
      setShowCTA(true);
    }
  }, [aiResponseCount]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const msg = inputValue;
    setInputValue('');
    setShowCTA(false); // Hide CTA when user engages again
    await addMessage(msg);
  };

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[70vw] h-[70vw] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1675023035272-3426884896f8?q=80&w=2532&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="flex-1 z-10 pt-20 flex flex-col max-w-5xl mx-auto w-full px-4 h-[calc(100vh-80px)]">
        {/* Chat Header (Conditional) */}
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-none text-center py-10 md:py-16 space-y-6"
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Sparkles size={12} className="text-indigo-400" />
                <span>Omara AI Assistant</span>
              </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl">
               Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Omara AI</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Your instant business assistant. Get answers about payments, integrations, and global compliance in seconds.
            </p>
          </motion.div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent pr-2 min-h-0">
          <div className="pb-4">
             {messages.length === 0 ? (
               <PublicOmaraAIQuickPrompts onSelect={handleQuickPrompt} />
             ) : (
               <div className="pt-4">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <PublicOmaraAIChatMessage key={msg.id} message={msg} />
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 text-gray-500 text-sm ml-4 mb-6"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                         <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                      </div>
                      <span className="text-xs font-medium tracking-wide">Omara is thinking...</span>
                    </motion.div>
                  )}

                  {/* Inline CTA */}
                  <AnimatePresence>
                    {showCTA && <CTACard onClose={() => setShowCTA(false)} />}
                  </AnimatePresence>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-none py-6">
           <div className="relative max-w-3xl mx-auto">
             {/* Clear Chat (Floating) */}
             {messages.length > 0 && (
               <motion.button 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 onClick={clearHistory}
                 className="absolute -top-10 right-0 text-xs text-gray-600 hover:text-red-400 flex items-center gap-1.5 transition-colors bg-gray-900/80 px-3 py-1.5 rounded-full border border-gray-800 hover:border-red-900/50" // Medium grey
               >
                 <Trash2 size={12} /> Clear Chat
               </motion.button>
             )}

             <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center bg-[#121217] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden focus-within:border-indigo-500/50 transition-colors duration-300">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything about Omara..."
                    className="flex-1 bg-transparent border-none text-gray-800 dark:text-white placeholder-gray-500 focus:ring-0 px-6 py-4 text-base font-medium" // Darker text, font-medium, placeholder adjusted
                    disabled={isLoading}
                  />
                  
                  <div className="pr-2">
                    <Button 
                      type="submit" 
                      size="icon"
                      disabled={!inputValue.trim() || isLoading}
                      className={cn(
                        "h-10 w-10 rounded-xl shrink-0 transition-all duration-300",
                        inputValue.trim() 
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                          : "bg-gray-800 text-gray-600"
                      )}
                    >
                      {isLoading ? (
                        <Sparkles className="w-5 h-5 animate-spin" />
                      ) : (
                        <ArrowUp className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
             </form>
             
             <div className="mt-4 text-center">
                <p className="text-[10px] sm:text-xs text-gray-600"> {/* Medium grey */}
                   {remaining > 0 ? (
                     <span>{remaining} free messages remaining.</span>
                   ) : (
                     <span className="text-red-400">Limit reached.</span>
                   )}
                   {" "}
                   <Link to="/register" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Sign up</Link> for unlimited access and advanced features.
                </p>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default PublicOmaraAIPage;