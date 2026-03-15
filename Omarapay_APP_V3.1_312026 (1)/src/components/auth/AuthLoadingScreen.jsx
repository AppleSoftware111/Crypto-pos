import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const AuthLoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-950 text-center"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        <img 
            src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
            alt="Omara Loading" 
            className="w-20 h-20 relative z-10 animate-bounce-slight"
        />
      </div>
      
      <div className="mt-8 flex items-center gap-3 text-lg font-medium text-gray-600 dark:text-gray-300">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span>Initializing Secure Session...</span>
      </div>
    </motion.div>
  );
};

export default AuthLoadingScreen;