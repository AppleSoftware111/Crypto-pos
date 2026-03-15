import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const accounts = [
    { name: 'Main Business Account', balance: '$25,480.50', currency: 'USD', type: 'Bank' },
    { name: 'OMARA FX Wallet', balance: '10,000.00', currency: 'USDFX', type: 'Wallet' },
    { name: 'BTC Wallet', balance: '0.5', currency: 'BTC', type: 'Wallet' },
];

const MasterFranchiseFinancialManagementPage = () => {
    const { toast } = useToast();
    
    const handleTransfer = () => {
        toast({
            title: "Transfer Initiated",
            description: "Your fund transfer has been processed.",
        });
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Financial Management</h1>
                <p className="text-muted-foreground">Manage your wallets, bank accounts, and funds.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Wallets & Bank Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Account/Wallet</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map((acc, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{acc.name}</TableCell>
                                    <TableCell>{acc.type}</TableCell>
                                    <TableCell>{acc.currency}</TableCell>
                                    <TableCell className="text-right">{acc.balance}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Fund Transfers & Payouts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-w-md">
                        <div className="space-y-2"><Label>Source Account</Label><Input placeholder="e.g., Main Business Account"/></div>
                        <div className="space-y-2"><Label>Destination Account/ID</Label><Input placeholder="e.g., Merchant ID, Wallet Address"/></div>
                        <div className="space-y-2"><Label>Amount</Label><Input type="number"/></div>
                        <Button onClick={handleTransfer}>Initiate Transfer</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseFinancialManagementPage;