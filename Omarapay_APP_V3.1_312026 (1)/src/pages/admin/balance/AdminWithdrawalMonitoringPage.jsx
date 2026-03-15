import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useDigitalBalance } from '@/context/DigitalBalanceContext';

const AdminWithdrawalMonitoringPage = () => {
    const { transactions } = useDigitalBalance();
    const withdrawals = transactions.filter(t => t.type === 'Withdrawal' || t.type === 'Transfer');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Withdrawal Monitoring</h1>
            <Card>
                <CardHeader><CardTitle>Outbound Transactions</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {withdrawals.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                                    <TableCell>{tx.user}</TableCell>
                                    <TableCell>{tx.type}</TableCell>
                                    <TableCell className="font-bold text-red-600">-{tx.currency} {tx.amount}</TableCell>
                                    <TableCell><Badge variant="outline">{tx.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminWithdrawalMonitoringPage;