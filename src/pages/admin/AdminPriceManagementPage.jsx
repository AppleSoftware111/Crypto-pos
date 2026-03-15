import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminPriceManagementPage = () => {
    const { toast } = useToast();

    const tiers = [
        { name: 'Merchant Basic', price: '$29/mo', features: 'Basic POS, 5 users', duration: 'Monthly' },
        { name: 'Merchant Pro', price: '$79/mo', features: 'Advanced POS, 20 users, API Access', duration: 'Monthly' },
        { name: 'Enterprise', price: 'Custom', features: 'All features, dedicated support', duration: 'Annual' },
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
                    <h1 className="text-3xl font-bold">Price Management</h1>
                    <p className="text-muted-foreground">Manage pricing structures for products and services.</p>
                </div>
                <Button onClick={handleAction}><PlusCircle className="mr-2 h-4 w-4" /> Add New Tier</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pricing Tiers</CardTitle>
                    <CardDescription>Define subscription plans for merchants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tier Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Features Included</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tiers.map((tier) => (
                                <TableRow key={tier.name}>
                                    <TableCell className="font-medium">{tier.name}</TableCell>
                                    <TableCell>{tier.price}</TableCell>
                                    <TableCell>{tier.features}</TableCell>
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

            <Card>
                <CardHeader>
                    <CardTitle>Promotional Pricing</CardTitle>
                    <CardDescription>Configure discounts, coupons, and campaigns.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">Set up temporary price reductions for marketing purposes.</p>
                    <Button onClick={handleAction} variant="secondary"><Tag className="mr-2 h-4 w-4" /> Create Promotion</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminPriceManagementPage;