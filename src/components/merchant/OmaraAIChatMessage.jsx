import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Bot, User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

const OmaraAIChatMessage = ({ message }) => {
  const isAi = message.role === 'assistant';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full mb-6",
        isAi ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] md:max-w-[75%] gap-3",
        isAi ? "flex-row" : "flex-row-reverse"
      )}>
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
          isAi 
            ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-glow-sm" 
            : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300" // Adjusted for better contrast
        )}>
          {isAi ? <Bot size={16} /> : <User size={16} />}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "relative p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
          isAi 
            ? "bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-800 font-medium rounded-tl-none backdrop-blur-sm" // Darker text and font-medium
            : "bg-indigo-600 text-white font-medium rounded-tr-none shadow-md" // Ensure white text with font-medium
        )}>
           {/* Message Content */}
           <div className="prose prose-sm dark:prose-invert max-w-none break-words">
             {isAi ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
             ) : (
                <p className="whitespace-pre-wrap m-0">{message.content}</p>
             )}
           </div>

           {/* Footer: Time & Actions */}
           <div className={cn(
             "flex items-center gap-2 mt-2 text-[10px] text-gray-600", // Medium grey
             isAi ? "justify-start" : "justify-end"
           )}>
              <span>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              
              {isAi && (
                <button 
                  onClick={handleCopy}
                  className="hover:text-gray-800 transition-colors ml-2 flex items-center gap-1" // Adjusted hover color
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied && "Copied"}
                </button>
              )}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OmaraAIChatMessage;