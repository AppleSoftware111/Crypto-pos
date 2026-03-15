import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, RefreshCw, Cloud } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TransactionHistoryPage = () => {
    const { toast } = useToast();

    const transactions = {
        all: [
            { id: 'TXN001', date: '2025-07-18', type: 'Card', amount: '$55.00', status: 'Completed' },
            { id: 'TXN002', date: '2025-07-18', type: 'Crypto', amount: '0.002 BTC', status: 'Completed' },
            { id: 'TXN003', date: '2025-07-17', type: 'Wallet', amount: '$25.00', status: 'Completed' },
            { id: 'TXN004', date: '2025-07-16', type: 'Card', amount: '$120.00', status: 'Refunded' },
        ],
        crypto: [
            { id: 'TXN002', date: '2025-07-18', type: 'Crypto', amount: '0.002 BTC', status: 'Completed' },
        ],
        card: [
            { id: 'TXN001', date: '2025-07-18', type: 'Card', amount: '$55.00', status: 'Completed' },
            { id: 'TXN004', date: '2025-07-16', type: 'Card', amount: '$120.00', status: 'Refunded' },
        ],
        wallet: [
            { id: 'TXN003', date: '2025-07-17', type: 'Wallet', amount: '$25.00', status: 'Completed' },
        ],
    };

    const handleAction = (feature) => {
        toast({
            title: "🚧 Feature in Progress",
            description: `${feature} will be available soon!`,
        });
    };

    const renderTable = (data) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((tx) => (
                    <TableRow key={tx.id}>
                        <TableCell className="font-mono">{tx.id}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.type}</TableCell>
                        <TableCell>
                            <Badge variant={tx.status === 'Completed' ? 'success' : 'destructive'}>{tx.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{tx.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Transaction History</h1>
                    <p className="text-muted-foreground">Access detailed insights into your transaction activities.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleAction('Refunding a transaction')}><RefreshCw className="mr-2 h-4 w-4" /> Process Refund</Button>
                    <Button onClick={() => handleAction('Accessing Omara Cloud Storage')}><Cloud className="mr-2 h-4 w-4" /> Omara Cloud</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>Filter transactions by type.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="crypto">Crypto</TabsTrigger>
                            <TabsTrigger value="card">Card Payments</TabsTrigger>
                            <TabsTrigger value="wallet">Digital Wallets</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">{renderTable(transactions.all)}</TabsContent>
                        <TabsContent value="crypto">{renderTable(transactions.crypto)}</TabsContent>
                        <TabsContent value="card">{renderTable(transactions.card)}</TabsContent>
                        <TabsContent value="wallet">{renderTable(transactions.wallet)}</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionHistoryPage;