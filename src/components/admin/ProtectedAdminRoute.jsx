import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isAdminWallet } from '@/config/adminConfig';
import { ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { logAdminAction } from '@/lib/adminActionLogger';
import AuthLoadingScreen from '@/components/auth/AuthLoadingScreen';

const ProtectedAdminRoute = ({ children }) => {
  const { isWalletAdmin, isConnected, walletAddress, isAdminAuthenticated, logout, loading } = useAuth();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  // Combine authentication checks
  const isAuthorized = isAdminAuthenticated || (isConnected && isAdminWallet(walletAddress));

  // Effect to handle loading delay and logging
  useEffect(() => {
    if (!loading) {
      // Small delay to ensure auth state is settled before showing access denied
      const timer = setTimeout(() => setIsReady(true), 100);
      
      if (isConnected && !isAuthorized) {
        logAdminAction(walletAddress || 'unknown', 'UNAUTHORIZED_ACCESS_ATTEMPT', { 
            path: location.pathname,
            reason: 'Wallet not in admin whitelist',
            wallet: walletAddress
        });
      }
      return () => clearTimeout(timer);
    }
  }, [loading, isConnected, isAuthorized, location, walletAddress]);

  if (loading || !isReady) {
    return <AuthLoadingScreen />;
  }

  // Case 1: Not logged in at all
  if (!isConnected && !isAdminAuthenticated) {
     return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Case 2: Logged in but unauthorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
        <Card className="max-w-md w-full border-red-200 dark:border-red-900 shadow-lg">
            <CardHeader className="text-center">
                <div className="mx-auto bg-red-100 dark:bg-red-900/30 p-3 rounded-full w-fit mb-4">
                    <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-2xl text-red-700 dark:text-red-500">Access Denied</CardTitle>
                <CardDescription>
                    Your connected wallet is not authorized for the Super Admin Dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border text-xs font-mono break-all text-center text-muted-foreground">
                    {walletAddress || "No Address Detected"}
                </div>
                <p className="text-sm text-center text-muted-foreground">
                    This incident has been logged. Please connect an authorized admin wallet to proceed.
                </p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full gap-2" onClick={logout}>
                    <LogOut className="h-4 w-4" /> Disconnect & Return Home
                </Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;