import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ArrowRight, Wallet, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BlockchainSwitchConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  fromChain,
  toChain,
  walletAddress,
  isSwitching,
  error // New prop for error display
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
        setAcknowledged(false);
    }
  }, [isOpen]);

  if (!fromChain || !toChain) return null;

  const FromIcon = fromChain.icon;
  const ToIcon = toChain.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSwitching && onClose()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Switch Network
          </DialogTitle>
          <DialogDescription>
            You are about to switch your active blockchain network.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Network Transition Visual */}
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 ${fromChain.borderColor || 'border-gray-200'}`}>
                {FromIcon && <FromIcon className="w-6 h-6 text-gray-500" />}
              </div>
              <span className="text-sm font-medium text-gray-500">{fromChain.name}</span>
            </div>

            <div className="flex flex-col items-center justify-center text-gray-400">
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${toChain.borderColor || 'border-primary'} bg-primary/5`}>
                {ToIcon && <ToIcon className={`w-6 h-6 ${toChain.textColor || 'text-primary'}`} />}
              </div>
              <span className={`text-sm font-bold ${toChain.textColor || 'text-primary'}`}>{toChain.name}</span>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="w-4 h-4" />
              <span>Connected Wallet:</span>
            </div>
            <code className="text-xs bg-background p-2 rounded block border font-mono truncate">
              {walletAddress}
            </code>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-start gap-3">
               <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
               <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {error}
               </p>
            </div>
          )}

          {/* Acknowledgment */}
          {!error && (
            <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                id="acknowledge-switch" 
                checked={acknowledged}
                onCheckedChange={setAcknowledged}
                />
                <Label
                htmlFor="acknowledge-switch"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-1"
                >
                I understand my wallet will switch networks and page data will refresh.
                </Label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSwitching}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={(!acknowledged && !error) || isSwitching} // Allow click if error (retry) or if ack checked
            className="min-w-[120px]"
            variant={error ? "destructive" : "default"}
          >
            {isSwitching ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Connecting...
              </span>
            ) : error ? (
                <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Retry
                </span>
            ) : (
              "Confirm Switch"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockchainSwitchConfirmation;