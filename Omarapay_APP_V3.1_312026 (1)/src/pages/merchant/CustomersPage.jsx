import React from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

const CustomersPage = () => {
    const { customers, loading, isModeDemo } = useMerchant();

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                <p className="text-muted-foreground">
                    {isModeDemo() ? "Manage your demo customer base." : "Manage your customer base and view their activity."}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">No customers found.</TableCell>
                                </TableRow>
                            ) : (
                                customers.map((cust) => (
                                    <TableRow key={cust.id}>
                                        <TableCell className="font-medium">
                                            {cust.name}
                                            {cust.isDemo && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1 rounded">DEMO</span>}
                                        </TableCell>
                                        <TableCell>{cust.email}</TableCell>
                                        <TableCell>${cust.totalSpent}</TableCell>
                                        <TableCell>{new Date(cust.lastTransaction).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-green-600 bg-green-50">{cust.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="Email"><Mail className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" title="Call"><Phone className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
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

export default CustomersPage;