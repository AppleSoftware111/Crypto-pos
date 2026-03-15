import React, { useState } from 'react';
import { useSwitchChain, useChainId, useConfig } from 'wagmi';
import { chainConfig, supportedChains } from '@/config/chainConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2, Wifi } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const ChainSwitcher = () => {
  // Hooks must be called at the top level unconditionally
  const { switchChain, isPending } = useSwitchChain();
  const chainId = useChainId();
  const config = useConfig();
  const { toast } = useToast();
  const [targetChain, setTargetChain] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentChainInfo = chainConfig[chainId] || { name: 'Unknown Network', icon: AlertCircle, color: 'text-gray-500' };
  const CurrentIcon = currentChainInfo.icon;

  const handleSwitchClick = (chain) => {
    if (chain.id === chainId) return;
    setTargetChain(chain);
    setShowConfirm(true);
  };

  const confirmSwitch = () => {
    if (targetChain) {
      switchChain({ chainId: targetChain.id }, {
        onSuccess: () => {
          toast({
            title: "Network Switched",
            description: `Successfully switched to ${targetChain.name}`,
          });
          setShowConfirm(false);
          setTargetChain(null);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Switch Failed",
            description: error.message,
          });
          setShowConfirm(false);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm", currentChainInfo.color)}>
                <CurrentIcon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Current Network</p>
                <h3 className="text-lg font-bold flex items-center gap-2">
                    {currentChainInfo.name}
                    <span className="flex items-center text-xs font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        <Wifi className="w-3 h-3 mr-1" /> Connected
                    </span>
                </h3>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supportedChains.map((chain) => {
            const chainItemConfig = chainConfig[chain.id] || {};
            const Icon = chainItemConfig.icon || AlertCircle;
            const isActive = chain.id === chainId;

            return (
                <Card 
                    key={chain.id} 
                    className={cn(
                        "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                        isActive ? "border-primary bg-primary/5" : ""
                    )}
                    onClick={() => handleSwitchClick(chain)}
                >
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className={cn("p-2 rounded-lg", chainItemConfig.bgColor || "bg-gray-100")}>
                            <Icon className={cn("w-6 h-6", chainItemConfig.color)} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm">{chain.name}</h4>
                            <p className="text-xs text-muted-foreground">{chain.nativeCurrency.symbol}</p>
                        </div>
                        {isActive && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        {isPending && targetChain?.id === chain.id && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    </CardContent>
                </Card>
            );
        })}
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Switch Network</DialogTitle>
                <DialogDescription>
                    You are about to switch from <b>{currentChainInfo.name}</b> to <b>{targetChain?.name}</b>.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button onClick={confirmSwitch} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Confirm Switch
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChainSwitcher;