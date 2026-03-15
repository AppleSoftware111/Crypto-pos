import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminMultiWalletManagementPage = () => {
    const { toast } = useToast();

    const wallets = [
        { userId: 'USR-001', walletId: 'WLT-001', currency: 'PHP', balance: '₱1,250,000.00', subWallets: 3, status: 'Active' },
        { userId: 'USR-002', walletId: 'WLT-002', currency: 'AED', balance: 'د.إ 500,000.00', subWallets: 2, status: 'Active' },
        { userId: 'USR-003', walletId: 'WLT-003', currency: 'USD', balance: '$75,000.00', subWallets: 4, status: 'Frozen' },
    ];
    
    const handleAction = () => {
        toast({
            title: "🚧 Feature in Progress",
            description: "This functionality is coming soon!",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Multi-Wallet Management</h1>
                <p className="text-muted-foreground">Manage multi-currency wallets for all users.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Wallet Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Total Balance</TableHead>
                                <TableHead>Sub-Wallets</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {wallets.map((wallet) => (
                                <TableRow key={wallet.walletId}>
                                    <TableCell className="font-mono">{wallet.userId}</TableCell>
                                    <TableCell>{wallet.balance} ({wallet.currency})</TableCell>
                                    <TableCell>{wallet.subWallets}</TableCell>
                                    <TableCell>
                                        <Badge variant={wallet.status === 'Active' ? 'success' : 'destructive'}>{wallet.status}</Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="icon" onClick={handleAction}><Eye className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="icon" onClick={handleAction}>
                                            {wallet.status === 'Active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminMultiWalletManagementPage;