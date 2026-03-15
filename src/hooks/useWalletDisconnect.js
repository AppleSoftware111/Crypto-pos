import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';

export const useWalletDisconnect = () => {
  const { disconnectAsync } = useDisconnect();
  const { toast } = useToast();

  const handleDisconnect = useCallback(async () => {
    try {
      // 1. Disconnect Wallet (Wagmi)
      try {
        await disconnectAsync();
      } catch (err) {
        console.warn("Wagmi disconnect warning:", err);
        // Continue cleanup even if wagmi throws (e.g. if already disconnected)
      }

      // 2. Clear Service Worker Caches
      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          await Promise.all(keys.map(key => caches.delete(key)));
          console.log("Service Worker caches cleared.");
        } catch (e) {
          console.error("Failed to clear cache", e);
        }
      }

      // 3. Clear Local and Session Storage
      localStorage.clear();
      sessionStorage.clear();

      // 4. Show Success Toast
      toast({
        title: "Disconnected",
        description: "Wallet disconnected and session cleared successfully.",
        variant: "default",
      });

      // 5. Force Reload to Reset All Context States and Redirect to Home
      // This ensures all in-memory React state (AuthContext, UserContext, etc.) is wiped clean.
      window.location.href = '/';

    } catch (error) {
      console.error("Disconnect process failed", error);
      toast({
        title: "Disconnection Error",
        description: "An error occurred while disconnecting. Please try again.",
        variant: "destructive",
      });
    }
  }, [disconnectAsync, toast]);

  return { disconnect: handleDisconnect };
};