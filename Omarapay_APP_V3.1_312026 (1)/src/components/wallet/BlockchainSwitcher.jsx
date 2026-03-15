import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSwitchChain, useChainId, useAccount } from 'wagmi';
import { blockchainConfig } from "@/config/blockchainConfig";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Wifi, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BlockchainSwitchConfirmation from "./BlockchainSwitchConfirmation";

const BlockchainSwitcher = () => {
  const { walletAddress } = useAuth();
  // Use Wagmi hooks directly instead of custom context
  const { switchChainAsync, isPending } = useSwitchChain();
  const chainId = useChainId();
  
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [targetChain, setTargetChain] = useState(null);
  const [switchError, setSwitchError] = useState(null);

  // Fallback to first chain if current chain is not in config
  const currentChain = blockchainConfig[chainId] || Object.values(blockchainConfig)[0];
  const Icon = currentChain?.icon;

  const handleChainSelect = (chain) => {
    if (chain.id === chainId) return;
    setTargetChain(chain);
    setSwitchError(null); 
    setIsConfirmationOpen(true);
  };

  const confirmSwitch = async () => {
    if (targetChain) {
      setSwitchError(null);
      
      try {
        await switchChainAsync({ chainId: targetChain.id });
        setIsConfirmationOpen(false);
        setTargetChain(null);
      } catch (error) {
        console.error("Switch chain error:", error);
        setSwitchError(error.message || "Failed to switch network. Please try again.");
      }
    }
  };

  if (!currentChain) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            disabled={isPending}
            variant="outline" 
            className={`
              h-10 gap-2 border-2 transition-all duration-300
              ${currentChain.borderColor || 'border-transparent'}
              hover:bg-accent/50
            `}
          >
            {isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              Icon && <Icon className={`w-4 h-4 ${currentChain.textColor || ''}`} />
            )}
            
            <span className="hidden sm:inline-block font-medium">
              {isPending ? "Switching..." : currentChain.name}
            </span>
            
            {!isPending && (
              <Badge variant="secondary" className="hidden md:flex ml-1 text-xs h-5 px-1.5 pointer-events-none bg-background/50">
                 {currentChain.currency}
              </Badge>
            )}
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72 p-2">
          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
            Select Network
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="grid gap-1">
            {Object.values(blockchainConfig).map(chain => {
              const ChainIcon = chain.icon;
              const isSelected = chainId === chain.id;

              return (
                <DropdownMenuItem
                  key={chain.id}
                  onClick={() => handleChainSelect(chain)}
                  className={`
                    flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors
                    ${isSelected ? "bg-accent border border-primary/20" : "hover:bg-muted"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${chain.color} bg-opacity-20`}>
                      {ChainIcon && <ChainIcon className={`w-4 h-4 ${chain.textColor}`} />}
                    </div>
                    <div className="flex flex-col">
                       <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : ''}`}>
                         {chain.name}
                       </span>
                       <span className="text-xs text-muted-foreground flex items-center gap-1">
                         Native: {chain.currency}
                         {isSelected && <span className="inline-block w-1 h-1 rounded-full bg-green-500 ml-1"></span>}
                       </span>
                    </div>
                  </div>
                  
                  {isSelected ? (
                    <div className="flex items-center text-xs text-green-600 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      <Wifi className="w-3 h-3 mr-1" />
                      Connected
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-muted-foreground/20 rounded-full" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
          
          <div className="mt-2 p-2 bg-muted/30 rounded text-[10px] text-muted-foreground flex gap-2 items-start">
             <AlertCircle className="w-3 h-3 mt-0.5" />
             <p>Switching networks will refresh your dashboard data and may prompt a wallet signature.</p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <BlockchainSwitchConfirmation 
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmSwitch}
        fromChain={currentChain}
        toChain={targetChain}
        walletAddress={walletAddress}
        isSwitching={isPending}
        error={switchError}
      />
    </>
  );
};

export default BlockchainSwitcher;