import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, TrendingUp, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const prompts = [
  {
    icon: CreditCard,
    label: "Payment Solutions",
    prompt: "What payment methods are supported for high-risk merchants?",
    color: "text-blue-600", // Darker blue for contrast
    bg: "bg-blue-100/70 hover:bg-blue-200/70 dark:bg-blue-950/40 dark:hover:bg-blue-900/60" // Adjusted bg for contrast
  },
  {
    icon: ShieldCheck,
    label: "Compliance & KYC",
    prompt: "What documents are required for Tier 2 verification?",
    color: "text-emerald-600", // Darker green for contrast
    bg: "bg-emerald-100/70 hover:bg-emerald-200/70 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60" // Adjusted bg for contrast
  },
  {
    icon: TrendingUp,
    label: "Business Growth",
    prompt: "How can I analyze my sales data to improve conversion?",
    color: "text-purple-600", // Darker purple for contrast
    bg: "bg-purple-100/70 hover:bg-purple-200/70 dark:bg-purple-950/40 dark:hover:bg-purple-900/60" // Adjusted bg for contrast
  },
  {
    icon: LifeBuoy,
    label: "Technical Support",
    prompt: "I'm having trouble with the API integration. Where are the docs?",
    color: "text-orange-600", // Darker orange for contrast
    bg: "bg-orange-100/70 hover:bg-orange-200/70 dark:bg-orange-950/40 dark:hover:bg-orange-900/60" // Adjusted bg for contrast
  }
];

const OmaraAIQuickPrompts = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-4xl mx-auto mt-6">
      {prompts.map((item, index) => (
        <motion.button
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(item.prompt)}
          className={`flex flex-col items-start gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-200 group text-left ${item.bg}`} // Adjusted border
        >
          <div className={`p-2 rounded-lg bg-white dark:bg-gray-900 ${item.color} shadow-sm`}> {/* Adjusted bg */}
            <item.icon size={20} />
          </div>
          <span className="text-primary font-semibold group-hover:text-primary relative z-10"> {/* Darker text, semibold */}
            {item.label}
          </span>
          <p className="text-gray-700 text-sm font-medium leading-tight group-hover:text-gray-800 relative z-10"> {/* Darker text, medium font */}
            {item.prompt}
          </p>
        </motion.button>
      ))}
    </div>
  );
};

export default OmaraAIQuickPrompts;