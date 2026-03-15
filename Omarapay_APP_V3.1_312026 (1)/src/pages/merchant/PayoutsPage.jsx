import React, { useState } from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Wallet, Landmark, ArrowRight, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const PayoutsPage = () => {
    const { payouts, loading, isModeDemo, addPayout } = useMerchant();
    const { toast } = useToast();
    const [amount, setAmount] = useState('');
    const [destination, setDestination] = useState('');

    const handlePayout = () => {
        if (!amount || !destination) {
            toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
            return;
        }

        const newPayout = {
            id: `PO-${isModeDemo() ? 'DEMO-' : ''}${uuidv4().split('-')[0].toUpperCase()}`,
            date: new Date().toISOString(),
            amount: parseFloat(amount).toFixed(2),
            currency: 'USD',
            status: 'Processing',
            method: 'Bank Transfer',
            destination: destination,
            isDemo: isModeDemo()
        };

        addPayout(newPayout);
        setAmount('');
        setDestination('');

        toast({
            title: isModeDemo() ? "Demo Payout Request Simulated" : "Payout Requested",
            description: isModeDemo() 
                ? "This is a simulation. No real funds were moved." 
                : "Your payout request has been submitted for processing.",
            variant: isModeDemo() ? "default" : "success"
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Payouts</h2>
                <p className="text-muted-foreground">Manage withdrawals and view payout history.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Payout History</CardTitle>
                        {isModeDemo() && <CardDescription>Showing simulated payout history</CardDescription>}
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payouts.length === 0 ? (
                                     <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">No payouts found.</TableCell>
                                    </TableRow>
                                ) : (
                                    payouts.map((payout) => (
                                        <TableRow key={payout.id}>
                                            <TableCell className="font-mono text-xs">
                                                {payout.id}
                                                {payout.isDemo && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1 rounded">DEMO</span>}
                                            </TableCell>
                                            <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                <Landmark className="h-4 w-4 text-muted-foreground" /> {payout.method}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={payout.status === 'Completed' ? 'success' : 'warning'}>
                                                    {payout.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold">${payout.amount}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Request Payout</CardTitle>
                        <CardDescription>Withdraw available funds to your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`p-4 rounded-lg border mb-4 ${isModeDemo() ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'}`}>
                            <p className={`text-sm ${isModeDemo() ? 'text-blue-800' : 'text-green-800'}`}>
                                {isModeDemo() ? "Simulated Balance" : "Available Balance"}
                            </p>
                            <p className={`text-2xl font-bold ${isModeDemo() ? 'text-blue-700' : 'text-green-700'}`}>
                                {isModeDemo() ? "$12,450.00" : "$0.00"}
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="pl-7" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Destination</Label>
                            <div className="flex gap-2 mb-2">
                                <Button variant="outline" className="flex-1 border-primary bg-primary/5 text-primary">
                                    <Landmark className="mr-2 h-4 w-4" /> Bank
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Wallet className="mr-2 h-4 w-4" /> Crypto
                                </Button>
                            </div>
                            <Input 
                                placeholder="Account / Wallet Address" 
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>

                        {!isModeDemo() && (
                            <div className="flex gap-2 p-3 bg-red-50 text-red-800 rounded text-xs items-start">
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>This is a real transaction. Funds will be deducted from your live balance.</p>
                            </div>
                        )}

                        <Button className="w-full mt-2" onClick={handlePayout}>
                            Request Withdrawal <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PayoutsPage;