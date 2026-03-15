import React, { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ShieldCheck, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const WalletSigningStep = ({ formData, onSignComplete, onError }) => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState(null);
  const [signature, setSignature] = useState(null);

  // Generate a temporary ID for the signing message context
  const tempId = React.useMemo(() => crypto.randomUUID(), []);

  const handleSign = async () => {
    if (!isConnected || !address) {
        setError("Please connect your wallet first.");
        return;
    }

    setIsSigning(true);
    setError(null);

    try {
        const message = `I confirm that this business ${formData.businessName} is registered to my wallet ${address}. UUID: ${tempId}`;
        
        const sig = await signMessageAsync({ message });
        
        setSignature(sig);
        onSignComplete(sig, address, tempId); // Pass tempId as the UUID context for this session if needed
    } catch (err) {
        console.error("Signing failed:", err);
        setError("User rejected the request or signing failed. Please try again.");
        if (onError) onError(err);
    } finally {
        setIsSigning(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> 
            Sign & Verify Ownership
        </h3>
        <p className="text-sm text-muted-foreground">
            To secure your merchant account, you must cryptographically sign a message with your wallet. 
            This binds your business strictly to your wallet address and unique user ID.
        </p>
      </div>

      <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
        <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Business Name</span>
                    <span className="font-medium">{formData.businessName}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Business Type</span>
                    <span className="font-medium">{formData.businessType}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Owner</span>
                    <span className="font-medium">{formData.ownerFirstName} {formData.ownerLastName}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Wallet</span>
                    <span className="font-mono text-xs truncate block" title={address}>
                        {isConnected ? address : 'Not Connected'}
                    </span>
                </div>
            </div>
        </CardContent>
      </Card>

      {!isConnected ? (
          <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Disconnected</AlertTitle>
              <AlertDescription>Please connect your wallet to proceed with signing.</AlertDescription>
          </Alert>
      ) : signature ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3"
          >
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                  <h4 className="font-bold text-green-700 dark:text-green-400">Signature Verified</h4>
                  <p className="text-xs text-green-600 dark:text-green-500">Your wallet ownership has been confirmed.</p>
              </div>
          </motion.div>
      ) : (
          <div className="pt-2">
             <Button 
                onClick={handleSign} 
                disabled={isSigning} 
                className="w-full h-12 text-base font-semibold"
                size="lg"
            >
                {isSigning ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Waiting for Signature...
                    </>
                ) : (
                    <>
                        <Wallet className="w-5 h-5 mr-2" />
                        Sign & Create Account
                    </>
                )}
            </Button>
            {error && (
                <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
            )}
          </div>
      )}

      <div className="text-xs text-center text-muted-foreground">
        No gas fees are required for this signature. It is purely for identity verification.
      </div>
    </div>
  );
};

export default WalletSigningStep;