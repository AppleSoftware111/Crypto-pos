import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, Check, Banknote, Smartphone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const ReceiveMoneyPage = ({ embedded = false }) => {
  const { walletAddress } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState('');

  // Fallback if no wallet connected
  const displayAddress = walletAddress || "Not Connected";
  const paymentLink = `https://omara.app/pay/${displayAddress}`;

  const handleCopy = (text, type) => {
      navigator.clipboard.writeText(text);
      setCopied(type);
      toast({ title: "Copied!", description: `${type} copied to clipboard.` });
      setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className={`w-full ${!embedded ? 'min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6 flex justify-center pt-12' : ''}`}>
      <div className={`w-full ${!embedded ? 'max-w-md' : ''} space-y-6`}>
        {!embedded && (
            <Link to="/wallet" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wallet
            </Link>
        )}

        {!embedded && <h1 className="text-3xl font-bold text-center">Receive Money</h1>}

        {/* Task 8: Zero balance allowed / New Wallet Friendly */}
        <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-100 dark:border-purple-800 flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5" />
            <p className="text-xs text-purple-800 dark:text-purple-300">
                You can receive funds to this wallet address regardless of your current balance.
            </p>
        </div>

        <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="bank">Bank Deposit</TabsTrigger>
            </TabsList>

            <TabsContent value="qr">
                <Card className="text-center shadow-lg border-0">
                    <CardContent className="pt-12 pb-12 flex flex-col items-center space-y-8">
                        <div className="bg-white p-4 rounded-xl shadow-inner border">
                            <QRCodeSVG value={paymentLink} size={200} level="H" includeMargin={true} />
                        </div>
                        
                        <div className="space-y-1 max-w-full px-4">
                            <p className="text-sm text-muted-foreground">Scan to pay</p>
                            <h2 className="text-sm font-bold tracking-tight font-mono break-all">{displayAddress}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full">
                            <Button variant="outline" onClick={() => handleCopy(displayAddress, 'Wallet Address')}>
                                {copied === 'Wallet Address' ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                Copy Address
                            </Button>
                             <Button variant="outline" onClick={() => handleCopy(paymentLink, 'Link')}>
                                {copied === 'Link' ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
                                Copy Link
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="bank">
                 <Card className="shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Banknote className="h-5 w-5" /> Local Bank Transfer</CardTitle>
                        <CardDescription>Funds credited within 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bank Name</span>
                                <span className="font-semibold">UnionBank</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Account Name</span>
                                <span className="font-semibold text-right">Omara Payment Service Provider</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Account Number</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-lg">DEMO012356780</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy('DEMO012356780', 'Account No')}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900">
                             <p className="text-yellow-800 dark:text-yellow-200 text-xs break-all">
                                <strong>Reference Required:</strong> You MUST include your Wallet Address <strong>{displayAddress.slice(0,10)}...</strong> in the transfer remarks/memo field for auto-crediting.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReceiveMoneyPage;