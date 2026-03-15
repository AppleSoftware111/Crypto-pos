import React, { useState } from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Filter } from 'lucide-react';

const TransactionsPage = () => {
    const { transactions, loading, isModeDemo } = useMerchant();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              txn.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                    <p className="text-muted-foreground">
                        {isModeDemo() ? "Viewing Demo Transactions" : "Viewing Live Transactions"}
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by ID or Customer..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">No transactions found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions.map((txn) => (
                                    <TableRow key={txn.id}>
                                        <TableCell className="font-mono text-xs">
                                            {txn.id}
                                            {txn.isDemo && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1 rounded">DEMO</span>}
                                        </TableCell>
                                        <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{txn.customer}</TableCell>
                                        <TableCell>{txn.type}</TableCell>
                                        <TableCell>{txn.method}</TableCell>
                                        <TableCell>
                                            <Badge variant={txn.status === 'Completed' ? 'success' : txn.status === 'Pending' ? 'warning' : 'destructive'}>
                                                {txn.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">${txn.amount}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionsPage;