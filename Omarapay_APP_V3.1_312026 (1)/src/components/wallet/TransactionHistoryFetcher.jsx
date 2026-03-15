import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, AlertCircle } from "lucide-react";

// Helper for block explorer URLs
const getExplorerUrl = (chainId) => {
    switch(chainId) {
        case 1: return 'https://etherscan.io';
        case 137: return 'https://polygonscan.com';
        case 56: return 'https://bscscan.com';
        default: return 'https://etherscan.io';
    }
};

const TransactionHistoryFetcher = ({ selectedChain }) => {
  const { walletAddress } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('conversions'); // 'conversions' (local) or 'onchain' (external)

  // Fetch Local Conversions (Reliable)
  const fetchLocalConversions = () => {
    const data = JSON.parse(localStorage.getItem('omara_conversion_history') || '[]');
    setHistory(data);
    setLoading(false);
    setError(null);
  };

  // Attempt to fetch On-Chain (Etherscan - Demo Mode)
  // NOTE: Without a backend proxy to hide API keys, we cannot reliably fetch on-chain history 
  // without asking the user for a key or hitting rate limits instantly. 
  // For this frontend-only demo, we will simulate the attempt or show a message.
  const fetchOnChain = async () => {
    setLoading(true);
    setError(null);
    
    // In a real app, you would call your backend which holds the Etherscan key.
    // Here, we'll simulate a fetch delay and then fallback or show empty.
    setTimeout(() => {
        setError("Public API rate limit exceeded or API key missing. Please view on Explorer.");
        setLoading(false);
        setHistory([]);
    }, 1000);
  };

  useEffect(() => {
    if (viewMode === 'conversions') {
        fetchLocalConversions();
    } else {
        fetchOnChain();
    }
  }, [viewMode, walletAddress]);

  const explorerUrl = getExplorerUrl(selectedChain?.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View your recent activity</CardDescription>
            </div>
            <div className="flex space-x-2">
                <Button 
                    variant={viewMode === 'conversions' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setViewMode('conversions')}
                >
                    Conversions
                </Button>
                <Button 
                    variant={viewMode === 'onchain' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setViewMode('onchain')}
                >
                    On-Chain
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        ) : error && viewMode === 'onchain' ? (
            <div className="text-center py-6 space-y-4">
                <div className="flex justify-center text-yellow-500"><AlertCircle /></div>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" asChild>
                    <a href={`${explorerUrl}/address/${walletAddress}`} target="_blank" rel="noreferrer">
                        View on Block Explorer <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </div>
        ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                No records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        history.map((tx, i) => (
                            <TableRow key={tx.id || i}>
                                <TableCell>
                                    <Badge variant="outline">{tx.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs">
                                        <span className="font-mono">{tx.from}</span> → <span className="font-mono">{tx.to}</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                        Rate: {tx.rate?.toFixed(4)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {new Date(tx.timestamp).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {tx.amountIn} {tx.from}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistoryFetcher;