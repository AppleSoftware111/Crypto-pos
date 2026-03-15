import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useOfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Back Online",
        description: "Reconnected to secure network.",
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-800"
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "No Internet Connection",
        description: "Reconnecting to secure network...",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  return isOffline;
};