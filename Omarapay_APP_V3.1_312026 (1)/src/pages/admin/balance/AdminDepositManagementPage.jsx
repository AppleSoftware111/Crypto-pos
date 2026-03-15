import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDigitalBalance } from '@/context/DigitalBalanceContext';

const AdminDepositManagementPage = () => {
  const { transactions } = useDigitalBalance();
  const deposits = transactions.filter(t => t.type === 'Deposit');

  return (
    <div className="space-y-6">
        <div className="flex justify-between">
            <h1 className="text-3xl font-bold">Deposit Management</h1>
            <Button>Settings & Limits</Button>
        </div>

        <Card>
            <CardHeader><CardTitle>Recent Deposits</CardTitle></CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deposits.map(tx => (
                            <TableRow key={tx.id}>
                                <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                                <TableCell>{tx.user}</TableCell>
                                <TableCell>{tx.method}</TableCell>
                                <TableCell className="font-bold text-green-600">+{tx.currency} {tx.amount}</TableCell>
                                <TableCell><Badge>{tx.status}</Badge></TableCell>
                                <TableCell>
                                    {tx.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="text-green-600">Approve</Button>
                                            <Button size="sm" variant="outline" className="text-red-600">Reject</Button>
                                        </div>
                                    )}
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

export default AdminDepositManagementPage;