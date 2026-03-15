import React, { useState, useEffect } from 'react';
import { useSignMessage } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const SignatureVerification = ({ onVerified }) => {
  const { signMessage, data: signature, isError, error, isPending } = useSignMessage();
  const { verifySignature, signatureVerified, walletAddress } = useAuth();
  const { toast } = useToast();
  const [localVerified, setLocalVerified] = useState(false);

  useEffect(() => {
    if (signature) {
      handleVerification(signature);
    }
  }, [signature]);

  useEffect(() => {
    if (signatureVerified) {
        setLocalVerified(true);
    }
  }, [signatureVerified]);

  const handleSign = () => {
    const message = `Welcome to Omara Payments!\n\nPlease sign this message to verify your ownership of the wallet: ${walletAddress}\n\nNonce: ${Date.now()}`;
    signMessage({ message });
  };

  const handleVerification = async (sig) => {
    try {
      const isValid = await verifySignature(sig);
      if (isValid) {
        setLocalVerified(true);
        toast({
          title: "Verification Successful",
          description: "Wallet ownership verified.",
        });
        if (onVerified) onVerified();
      } else {
        toast({
          title: "Verification Failed",
          description: "Could not verify signature.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Verification error", err);
      toast({
        title: "Error",
        description: "Something went wrong during verification.",
        variant: "destructive"
      });
    }
  };

  if (localVerified || signatureVerified) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-300">Wallet Verified</h3>
              <p className="text-sm text-green-700 dark:text-green-500">You can proceed to dashboard.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-lg">Verify Ownership</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          To ensure security, please sign a message with your wallet to prove ownership. This does not cost any gas fees.
        </p>

        {isError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100 p-2 rounded border border-red-200">
            <AlertCircle className="w-4 h-4" />
            <span>{error?.message?.slice(0, 60) || "Signing failed"}...</span>
          </div>
        )}

        <Button 
          onClick={handleSign} 
          disabled={isPending} 
          className="w-full"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing...
            </>
          ) : (
            "Sign Message"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignatureVerification;