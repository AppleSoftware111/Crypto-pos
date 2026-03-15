import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const UserLoginPage = () => {
  const { isUserAuthenticated, currentUser, isConnected, walletAddress } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. If user is fully authenticated (exists in DB), redirect to dashboard
    if (isUserAuthenticated && currentUser?.role && currentUser.role !== 'Guest') {
      toast({
        title: "✅ Wallet Connected!",
        description: `Welcome back, ${currentUser.name || 'User'}!`,
      });
      
      if (currentUser.role === 'Merchant') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/wallet', { replace: true });
      }
    } 
    // 2. If connected but role is Guest (does not exist in DB), redirect to register
    else if (isConnected && walletAddress && currentUser?.role === 'Guest') {
       toast({
        title: "Registration Required",
        description: "Please complete your profile to continue.",
      });
      navigate('/register', { replace: true });
    }
  }, [isUserAuthenticated, currentUser, isConnected, walletAddress, navigate, toast]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 hero-pattern p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-950/80">
          <CardHeader className="text-center flex flex-col items-center">
             <img 
                src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                alt="Omara Logo" 
                className="h-16 w-16 mb-4"
             />
            <CardTitle className="text-3xl font-bold tracking-tight text-gradient">Web3 Login</CardTitle>
            <CardDescription>Connect your wallet to access Omara Payments.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="p-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
               {/* 
                  Standard ConnectButton from RainbowKit. 
                  No SIWE configuration is passed, so it only connects the wallet.
               */}
               <ConnectButton label="Connect Wallet" accountStatus="avatar" chainStatus="icon" showBalance={false} />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Supported Wallets: MetaMask, Rainbow, Coinbase Wallet, WalletConnect, and more.
            </p>
          </CardContent>
          <CardFooter className="flex-col space-y-4 text-center">
            <Button variant="ghost" asChild className="text-sm text-gray-500 hover:text-primary">
                <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login Portal
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserLoginPage;