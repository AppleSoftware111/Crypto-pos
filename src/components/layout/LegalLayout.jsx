import React from 'react';
import Footer from './Footer';

const LegalLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
           {/* Header Section */}
           <div className="mb-8 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <img 
                   src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                   alt="Omara Logo" 
                   className="h-10 w-10"
                />
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Omara Payments</h1>
              </div>
              
              {title && (
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
                    {title}
                </h2>
              )}
              
              {subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    {subtitle}
                </p>
              )}
           </div>

           {/* Content Card */}
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
               <div className="p-6 md:p-10">
                   {children}
               </div>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalLayout;