import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Bot, User, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const PublicOmaraAIChatMessage = ({ message }) => {
  const isAi = message.role === 'assistant';
  const isSystem = message.role === 'system';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full justify-center mb-6"
      >
         <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 max-w-lg text-center text-sm text-red-200">
            <div className="flex justify-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <ReactMarkdown 
                components={{
                    a: ({node, ...props}) => <Link to={props.href} className="text-red-300 underline font-semibold hover:text-white" {...props} />
                }}
            >
                {message.content}
            </ReactMarkdown>
         </div>
      </motion.div>
    );
  }

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
        "flex max-w-[90%] md:max-w-[80%] gap-3",
        isAi ? "flex-row" : "flex-row-reverse"
      )}>
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-lg",
          isAi 
            ? "bg-gradient-to-br from-indigo-500 to-cyan-500 border-indigo-400 text-white" 
            : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300" // Adjusted for better contrast
        )}>
          {isAi ? <Bot size={16} /> : <User size={16} />}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "relative p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md",
          isAi 
            ? "bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-800 font-medium rounded-tl-none" // Darker text and font-medium
            : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-tr-none border border-indigo-500/30" // Ensure white text with font-medium
        )}>
           {/* Message Content */}
           <div className="prose prose-sm prose-invert max-w-none break-words">
             {isAi ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
             ) : (
                <p className="whitespace-pre-wrap m-0">{message.content}</p>
             )}
           </div>

           {/* Footer: Actions */}
           {isAi && (
             <div className="flex items-center justify-start gap-2 mt-3 pt-2 border-t border-gray-700/50">
                <button 
                  onClick={handleCopy}
                  className="text-[10px] uppercase tracking-wider text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1.5" // Medium grey, darker hover
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />} {/* Use accent color for check */}
                  {copied ? "Copied" : "Copy"}
                </button>
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
};

export default PublicOmaraAIChatMessage;