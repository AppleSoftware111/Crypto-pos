import React, { useState, useEffect } from 'react';
import { useUsers } from '@/context/UserContext';
import { ewalletConfig } from '@/config/ewalletConfig';
import { paymentStorage } from '@/lib/paymentStorageService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Check, Link2, Unlink } from 'lucide-react';
import { validateEWallet } from '@/lib/paymentValidation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EWalletIntegration = () => {
  const { userCountry } = useUsers();
  const { toast } = useToast();
  const [wallets, setWallets] = useState([]);
  const [connectedWallets, setConnectedWallets] = useState([]);
  
  const [connectingId, setConnectingId] = useState(null);
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    setWallets(ewalletConfig[userCountry] || []);
    setConnectedWallets(paymentStorage.getEWallets());
  }, [userCountry]);

  const handleConnect = () => {
      if (!validateEWallet(identifier)) {
          toast({ variant: "destructive", title: "Invalid Identifier", description: "Please enter a valid mobile number." });
          return;
      }
      
      const provider = wallets.find(w => w.id === connectingId);
      const newConnection = {
          id: connectingId,
          name: provider.name,
          identifier: identifier,
          connectedAt: new Date().toISOString()
      };
      
      const updated = [...connectedWallets.filter(w => w.id !== connectingId), newConnection];
      paymentStorage.saveEWallets(updated);
      setConnectedWallets(updated);
      setConnectingId(null);
      setIdentifier('');
      toast({ title: "Connected", description: `Successfully connected ${provider.name}` });
  };

  const handleDisconnect = (id) => {
      const updated = connectedWallets.filter(w => w.id !== id);
      paymentStorage.saveEWallets(updated);
      setConnectedWallets(updated);
      toast({ title: "Disconnected", description: "Wallet disconnected." });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map(wallet => {
            const isConnected = connectedWallets.find(w => w.id === wallet.id);
            const Icon = wallet.icon;

            return (
                <Card key={wallet.id} className={cn("border-2", isConnected ? "border-green-200 bg-green-50" : "border-transparent bg-gray-50")}>
                    <CardContent className="p-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg", wallet.bgColor, wallet.color)}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">{wallet.name}</span>
                            </div>
                            {isConnected && <Check className="w-5 h-5 text-green-600" />}
                        </div>
                        
                        {isConnected ? (
                            <div>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Connected: {isConnected.identifier}
                                </p>
                                <Button variant="outline" size="sm" onClick={() => handleDisconnect(wallet.id)} className="w-full border-red-200 text-red-600 hover:bg-red-50">
                                    <Unlink className="w-4 h-4 mr-2" /> Disconnect
                                </Button>
                            </div>
                        ) : (
                            <Button size="sm" onClick={() => setConnectingId(wallet.id)} className="w-full">
                                <Link2 className="w-4 h-4 mr-2" /> Connect
                            </Button>
                        )}
                    </CardContent>
                </Card>
            );
        })}

        <Dialog open={!!connectingId} onOpenChange={() => setConnectingId(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect {wallets.find(w => w.id === connectingId)?.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    <Label>Mobile Number</Label>
                    <Input 
                        placeholder="09..." 
                        value={identifier} 
                        onChange={e => setIdentifier(e.target.value)} 
                    />
                    <p className="text-xs text-muted-foreground">Enter your registered mobile number for this wallet.</p>
                </div>
                <DialogFooter>
                    <Button onClick={handleConnect}>Link Wallet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default EWalletIntegration;