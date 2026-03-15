import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if consent is already stored
    const consent = localStorage.getItem('cookieConsent');
    
    // Don't show on login/register pages initially, or if already consented
    const isAuthPage = ['/login', '/register', '/admin/login'].includes(location.pathname);
    
    if (!consent && !isAuthPage) {
        // Small delay for better UX
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    } else {
        setIsVisible(false);
    }
  }, [location.pathname]);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
      // Typically 'decline' might strictly mean 'essential only', but for this UI we just close it
      // and maybe store a 'declined' state if we had granular controls.
      // For now, we'll just close it for the session or store a rejection.
      localStorage.setItem('cookieConsent', 'declined'); 
      setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 flex justify-center pointer-events-none"
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl p-4 md:p-6 max-w-4xl w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-auto">
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0">
                 <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">We use cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies. 
                  <a 
                    href="https://www.omarapay.com/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  >
                    Read Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDecline}
                className="flex-1 md:flex-none"
              >
                Decline
              </Button>
              <Button 
                size="sm" 
                onClick={handleAccept}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white"
              >
                Accept All
              </Button>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;