import React, { useState, useEffect } from "react";
import { RefreshCcw, Coins, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useBalance, useChainId } from "wagmi";

// Sub-component to handle individual token balance fetching safely
// This fixes the React Hook violation by ensuring useBalance is called at the top level of a component
const TokenBalanceItem = ({ token, walletAddress, onRemove }) => {
  const {
    data,
    isLoading,
    isError,
  } = useBalance({
    address: walletAddress,
    token: token.address,
    watch: true,
    enabled: Boolean(walletAddress) && Boolean(token.address),
  });

  const formatted = data?.formatted
    ? parseFloat(data.formatted).toFixed(4)
    : "0.0000";

  return (
    <div
      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-lg group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Coins className="w-4 h-4 text-primary" />
        </div>

        <div>
          <p className="font-medium text-sm">{token.symbol}</p>
          <p className="text-xs text-muted-foreground">
            {isError ? "Error" : isLoading ? "..." : formatted}
          </p>
        </div>
      </div>

      <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(token.address)}
      >
          <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

const WalletBalanceDisplay = ({ selectedChain }) => {
  const { walletAddress } = useAuth();
  const chainId = useChainId();
  const activeChainId = selectedChain?.id || chainId;

  // --- Native balance (Real) ---
  const {
    data: nativeData,
    isLoading: nativeLoading,
    isError: nativeError,
    refetch: refetchNative,
  } = useBalance({
    address: walletAddress,
    watch: true,
    enabled: Boolean(walletAddress),
  });

  // --- Custom Token Management ---
  const [customTokens, setCustomTokens] = useState([]);
  const [newTokenAddress, setNewTokenAddress] = useState("");
  const [newTokenSymbol, setNewTokenSymbol] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load custom tokens from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`omara_custom_tokens_${activeChainId}`);
    if (saved) {
        setCustomTokens(JSON.parse(saved));
    } else {
        setCustomTokens([]);
    }
  }, [activeChainId]);

  const addToken = () => {
    if (!newTokenAddress || !newTokenSymbol) return;
    const newToken = { address: newTokenAddress, symbol: newTokenSymbol.toUpperCase() };
    const updated = [...customTokens, newToken];
    setCustomTokens(updated);
    localStorage.setItem(`omara_custom_tokens_${activeChainId}`, JSON.stringify(updated));
    setNewTokenAddress("");
    setNewTokenSymbol("");
    setIsDialogOpen(false);
  };

  const removeToken = (address) => {
    const updated = customTokens.filter(t => t.address !== address);
    setCustomTokens(updated);
    localStorage.setItem(`omara_custom_tokens_${activeChainId}`, JSON.stringify(updated));
  };

  const handleRefresh = () => {
    refetchNative();
    // Note: Token balances automatically update via watch: true in the child components.
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          On-Chain Assets ({selectedChain?.name || "Connected Network"})
        </CardTitle>

        <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8" title="Add Token">
                        <Plus className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Custom Token</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Token Contract Address</Label>
                            <Input 
                                placeholder="0x..." 
                                value={newTokenAddress} 
                                onChange={(e) => setNewTokenAddress(e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Token Symbol</Label>
                            <Input 
                                placeholder="USDT" 
                                value={newTokenSymbol} 
                                onChange={(e) => setNewTokenSymbol(e.target.value)} 
                            />
                        </div>
                        <Button onClick={addToken} className="w-full">Add Token</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="h-8 w-8"
            disabled={!walletAddress}
            title="Refresh balances"
            >
            <RefreshCcw className={`h-4 w-4 ${nativeLoading ? "animate-spin" : ""}`} />
            </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Native Balance */}
        <div className="mb-6">
          {nativeError ? (
            <div className="text-sm text-red-500">Failed to load native balance.</div>
          ) : (
            <>
              <div className="text-2xl font-bold flex items-center gap-2">
                {nativeLoading ? "..." : parseFloat(nativeData?.formatted || 0).toFixed(4)}
                <span className="text-lg font-normal text-muted-foreground">
                  {nativeData?.symbol || "ETH"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Native Coin Balance
              </p>
            </>
          )}
        </div>

        {/* Token Balances */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tracked Tokens
          </p>

          {customTokens.length === 0 && (
            <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
              No tokens tracked. Click + to add one.
            </div>
          )}

          {customTokens.map((token) => (
            <TokenBalanceItem 
                key={token.address} 
                token={token} 
                walletAddress={walletAddress} 
                onRemove={removeToken} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalanceDisplay;