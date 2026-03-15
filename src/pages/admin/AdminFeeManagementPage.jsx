import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, BarChart2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminFeeManagementPage = () => {
    const { toast } = useToast();

    const fees = [
        { name: 'Transaction Fee', type: 'Percentage', value: '2.9%', appliesTo: 'All Card Payments', status: 'Active' },
        { name: 'Crypto Conversion Fee', type: 'Percentage', value: '1.0%', appliesTo: 'BTC, ETH', status: 'Active' },
        { name: 'Withdrawal Fee', type: 'Fixed', value: '$5.00', appliesTo: 'Bank Transfer', status: 'Active' },
        { name: 'Subscription Fee', type: 'Fixed', value: '$49.99/mo', appliesTo: 'Merchant Pro Plan', status: 'Inactive' },
    ];

    const handleAction = () => {
        toast({
            title: "🚧 Feature in Progress",
            description: "This functionality is coming soon!",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Fee Management</h1>
                    <p className="text-muted-foreground">Configure all transaction fees and commission structures.</p>
                </div>
                <Button onClick={handleAction}><PlusCircle className="mr-2 h-4 w-4" /> Add New Fee</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Global Fee Structures</CardTitle>
                    <CardDescription>Master configuration for all platform fees.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fee Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Applies To</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fees.map((fee) => (
                                <TableRow key={fee.name}>
                                    <TableCell className="font-medium">{fee.name}</TableCell>
                                    <TableCell>{fee.type}</TableCell>
                                    <TableCell>{fee.value}</TableCell>
                                    <TableCell>{fee.appliesTo}</TableCell>
                                    <TableCell>
                                        <Badge variant={fee.status === 'Active' ? 'success' : 'secondary'}>{fee.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={handleAction}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tiered &amp; Commission Rules</CardTitle>
                        <CardDescription>Define complex fee rules based on volume or user tier.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm mb-4">e.g., "Merchants with &gt; $1M monthly volume get 0.5% lower transaction fee".</p>
                        <Button onClick={handleAction} variant="secondary">Configure Rules</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Collection Monitoring</CardTitle>
                        <CardDescription>Dashboard showing total fees collected.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm mb-4">View breakdown by type and reconciliation status.</p>
                        <Button onClick={handleAction} variant="secondary"><BarChart2 className="mr-2 h-4 w-4" /> View Reports</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminFeeManagementPage;