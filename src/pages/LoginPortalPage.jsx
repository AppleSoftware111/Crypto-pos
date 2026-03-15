import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, LogOut, Copy, Loader2, ArrowLeft } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

import { useAuth } from '@/context/AuthContext';
import SignatureVerification from '@/components/auth/SignatureVerification';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

const LoginPortalPage = ({ portalType = 'user' }) => {
  const navigate = useNavigate();
  const { signatureVerified, isWalletAdmin } = useAuth();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Determine portal specific UI
  const portalConfig = {
    user: {
        title: "User Login",
        description: "Access your digital wallet and merchant tools",
        redirect: "/chain-selection",
        badge: null
    },
    admin: {
        title: "Admin Portal",
        description: "Restricted access for authorized administrators",
        redirect: "/admin/dashboard",
        badge: "Authorized Access Only"
    },
    register: {
        title: "Create Account",
        description: "Connect your wallet to get started with Omara",
        redirect: "/chain-selection",
        badge: "New User"
    }
  };

  const currentConfig = portalConfig[portalType] || portalConfig.user;

  // Login Redirection Logic
  useEffect(() => {
    if (signatureVerified && isConnected) {
      setIsRedirecting(true);
      
      const timer = setTimeout(() => {
        // Force redirect based on portalType logic
        if (portalType === 'admin') {
            if (isWalletAdmin) {
                navigate(currentConfig.redirect, { replace: true });
            } else {
                // If trying to access admin portal but not an admin, stay here or go to user home
                // The ProtectedAdminRoute will handle the block, but here we can guide them
                navigate(currentConfig.redirect, { replace: true }); // Let the route guard handle the denial
            }
        } else {
            // For user/register, go to chain selection
            navigate(currentConfig.redirect, { replace: true });
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [signatureVerified, isWalletAdmin, navigate, isConnected, portalType, currentConfig]);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    toast({ title: 'Copied', description: 'Wallet address copied.' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 font-sans relative">
      {/* Back to Website Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="absolute top-4 left-4"
      >
        <Button 
          variant="outline" 
          onClick={() => window.open("https://www.omarapay.com", "_blank")}
          className="flex items-center gap-2 text-sm transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
            alt="Omara Logo" 
            className="h-16 w-16 mb-4 drop-shadow-md"
          />
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Omara Payments
          </h1>
          <p className="text-muted-foreground">
            Secure Web3 Access
          </p>

          <div className="flex justify-center gap-4 mt-6 text-sm">
            {['Connect', 'Verify', 'Dashboard'].map((step, i) => (
              <div
                key={step}
                className={`flex items-center gap-2 ${
                  (i === 0 && isConnected) || (i === 1 && signatureVerified)
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <span className="w-6 h-6 rounded-full border flex items-center justify-center">
                  {i + 1}
                </span>
                {step}
                {i < 2 && <ChevronRight className="w-4 h-4" />}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-xl relative overflow-hidden border-t-4 border-t-primary">
          {isRedirecting && (
             <div className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                 <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                 <h3 className="text-lg font-semibold">Redirecting securely...</h3>
                 <p className="text-muted-foreground text-sm">Welcome to Omara</p>
             </div>
          )}
        
          <CardHeader>
             <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-2xl">{currentConfig.title}</CardTitle>
                {currentConfig.badge && (
                    <Badge variant="outline" className="border-primary/50 text-primary">
                        {currentConfig.badge}
                    </Badge>
                )}
             </div>
            <CardDescription>
              {currentConfig.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!isConnected ? (
              <div className="flex justify-center py-4">
                <ConnectButton />
              </div>
            ) : (
              <>
                <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                        <ShieldCheck className="w-4 h-4" />
                        Connected Wallet
                      </div>
                      <div className="mt-1 font-mono break-all text-xs sm:text-sm">{address}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={copyAddress}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <SignatureVerification onVerified={() => {}} />

                {!signatureVerified && (
                    <Button
                    variant="ghost"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                    onClick={() => {
                        disconnect();
                        navigate('/');
                    }}
                    >
                    <LogOut className="mr-2 w-4 h-4" />
                    Disconnect & Cancel
                    </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPortalPage;