import React from 'react';
import { cn } from '@/lib/utils';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

const StandardPageWrapper = ({ children, title, subtitle, className }) => {
  useOfflineStatus(); // Hook offline status detection on every standard page

  return (
    <div className={cn("min-h-screen bg-brand-light dark:bg-brand-dark transition-colors duration-300", className)}>
      <div className="container mx-auto px-4 md:px-8 py-8">
        {(title || subtitle) && (
          <div className="mb-8 space-y-2">
            {title && (
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
            )}
            {subtitle && (
              <p className="text-muted-foreground text-lg max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Glassmorphism Container for Main Content */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 dark:border-slate-800/50 p-4 md:p-6 transition-all duration-300">
           {children}
        </div>
      </div>
    </div>
  );
};

export default StandardPageWrapper;