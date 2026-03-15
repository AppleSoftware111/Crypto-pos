import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { paymentStorage } from '@/lib/paymentStorageService';
import { validateWalletAddress } from '@/lib/paymentValidation';
import { useToast } from '@/components/ui/use-toast';
import { Save, Trash2, Edit2, Check } from 'lucide-react';

const PayoutDetails = () => {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState([]);
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('ethereum');
  const [token, setToken] = useState('USDT');

  useEffect(() => {
    setPayouts(paymentStorage.getPayoutDetails());
  }, []);

  const handleSave = () => {
    if (!validateWalletAddress(address)) {
        toast({ variant: "destructive", title: "Invalid Address", description: "Please enter a valid wallet address." });
        return;
    }
    const newEntry = { id: Date.now(), address, network, token };
    const updated = [...payouts, newEntry];
    paymentStorage.savePayoutDetails(updated);
    setPayouts(updated);
    setAddress('');
    toast({ title: "Saved", description: "Payout details saved successfully." });
  };

  const handleDelete = (id) => {
    const updated = payouts.filter(p => p.id !== id);
    paymentStorage.savePayoutDetails(updated);
    setPayouts(updated);
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Add Payout Address</CardTitle>
                <CardDescription>Configure where you want to receive your crypto withdrawals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Payout Network</Label>
                        <Select value={network} onValueChange={setNetwork}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ethereum">Ethereum</SelectItem>
                                <SelectItem value="bsc">BSC</SelectItem>
                                <SelectItem value="polygon">Polygon</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Preferred Token</Label>
                        <Select value={token} onValueChange={setToken}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USDT">USDT</SelectItem>
                                <SelectItem value="USDC">USDC</SelectItem>
                                <SelectItem value="DAI">DAI</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input 
                        placeholder="0x..." 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                    />
                </div>
                <Button onClick={handleSave} className="w-full"><Save className="w-4 h-4 mr-2" /> Save Payout Details</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Saved Payout Addresses</CardTitle>
            </CardHeader>
            <CardContent>
                {payouts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No saved payout addresses.</p>
                ) : (
                    <div className="space-y-3">
                        {payouts.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm">{p.token}</span>
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{p.network}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono mt-1">{p.address}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
};

export default PayoutDetails;