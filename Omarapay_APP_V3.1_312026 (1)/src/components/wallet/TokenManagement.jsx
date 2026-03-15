import React from 'react';
import { useChainId } from 'wagmi';
import { tokenConfig } from '@/config/tokenConfig';
import { chainConfig } from '@/config/chainConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wallet, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TokenManagement = () => {
  const chainId = useChainId();
  const { toast } = useToast();
  
  const tokens = tokenConfig[chainId] || [];
  const currentChain = chainConfig[chainId] || { name: 'Unknown Chain' };

  const addTokenToWallet = async (token) => {
    if (!window.ethereum) return;
    try {
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: token.address,
                    symbol: token.symbol,
                    decimals: token.decimals,
                },
            },
        });

        if (wasAdded) {
            toast({ title: "Success", description: `${token.symbol} added to wallet!` });
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to add token." });
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Token Management</CardTitle>
            <CardDescription>Manage visible tokens for {currentChain.name}</CardDescription>
        </CardHeader>
        <CardContent>
            {tokens.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No configured tokens for this network.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tokens.map((token) => (
                        <div key={token.address} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                    <Wallet className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">{token.name}</h4>
                                    <p className="text-xs text-muted-foreground">{token.symbol}</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => addTokenToWallet(token)}>
                                <PlusCircle className="w-4 h-4 mr-2" /> Add
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
  );
};

export default TokenManagement;