import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const prompts = [
  "How does Omara work?",
  "What payment methods do you support?",
  "Is my data secure?",
  "How do I get started?",
  "What are your fees?",
  "Do you support international transfers?"
];

const PublicOmaraAIQuickPrompts = ({ onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <p className="text-center text-gray-600 mb-6 text-sm uppercase tracking-wider font-medium">Try asking...</p> {/* Medium grey */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(prompt)}
            className="group relative p-4 text-left rounded-xl bg-gray-100/70 hover:bg-gray-200/70 dark:bg-gray-800/40 dark:hover:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden" // Adjusted bg & border
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
            <span className="text-primary font-semibold group-hover:text-primary relative z-10 block pr-6"> {/* Darker text, semibold */}
              {prompt}
            </span>
            <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PublicOmaraAIQuickPrompts;