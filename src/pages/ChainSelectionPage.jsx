import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { blockchainConfig } from '@/config/blockchainConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, LogOut, AlertTriangle, Loader2, Wallet } from 'lucide-react';
import { useWalletDisconnect } from '@/hooks/useWalletDisconnect';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ChainSelectionPage = () => {
  const navigate = useNavigate();
  const { setSelectedBlockchain, selectedBlockchain, signatureVerified, isConnected, walletAddress } = useAuth();
  const { disconnect } = useWalletDisconnect();
  
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    if (!isConnected) {
        navigate('/login');
    } else if (!signatureVerified) {
        navigate('/login');
    }
  }, [isConnected, signatureVerified, navigate]);

  const handleSelect = (chain) => {
    setSelectedBlockchain(chain);
    navigate('/dashboard');
  };

  const handleSkip = () => {
      handleSelect(blockchainConfig.ethereum);
  };

  const handleConfirmDisconnect = async () => {
    setIsDisconnecting(true);
    await disconnect();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 p-6 flex flex-col items-center justify-center relative">
      
      <div className="absolute top-6 right-6">
        <Button 
          variant="destructive" 
          size="sm" 
          className="bg-red-500 hover:bg-red-600 text-white shadow-sm gap-2"
          onClick={() => setIsDisconnectDialogOpen(true)}
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Disconnect Wallet</span>
        </Button>
      </div>

      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 dark:text-white">Select Your Network</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
                Choose the primary blockchain network you wish to interact with.
            </p>
            
            {walletAddress && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span>Connected: </span>
                    <span className="font-mono font-medium text-gray-900 dark:text-white" title={walletAddress}>
                        {walletAddress}
                    </span>
                </div>
            )}
            
            <p className="text-sm text-muted-foreground italic">
                Note: Switching wallets later will show different merchant accounts tied to that specific wallet.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(blockchainConfig).map((chain, index) => {
                const Icon = chain.icon;
                const isSelected = selectedBlockchain?.id === chain.id;

                return (
                    <motion.div
                        key={chain.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(chain)}
                        className="cursor-pointer h-full"
                    >
                        <Card className={`h-full border-2 transition-all duration-200 bg-white dark:bg-gray-900 ${isSelected ? 'border-primary ring-2 ring-primary/20 shadow-lg' : 'hover:border-gray-400 dark:hover:border-gray-600 border-transparent shadow-md'}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className={`text-xl font-bold ${chain.textColor}`}>{chain.name}</CardTitle>
                                {isSelected && <div className="bg-primary text-white rounded-full p-1"><Check className="w-4 h-4" /></div>}
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className={`w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 shadow-inner mx-auto`}>
                                    <Icon className={`w-10 h-10 ${chain.textColor}`} />
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span>Chain ID:</span>
                                        <span className="font-mono">{chain.chainId}</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span>Currency:</span>
                                        <span className="font-bold">{chain.currency}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>

        <div className="flex justify-center pt-8">
            <Button variant="ghost" onClick={handleSkip} className="text-gray-500 hover:text-primary gap-2">
                Skip for now (Default to Ethereum) <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
      </div>

      <Dialog open={isDisconnectDialogOpen} onOpenChange={setIsDisconnectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Disconnect Wallet?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to disconnect? This will clear your session and return you to the home page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDisconnectDialogOpen(false)}
              disabled={isDisconnecting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDisconnect}
              disabled={isDisconnecting}
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChainSelectionPage;