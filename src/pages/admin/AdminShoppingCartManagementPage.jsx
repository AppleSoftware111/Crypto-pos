import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminShoppingCartManagementPage = () => {
    const { toast } = useToast();

    const features = [
        { name: 'Abandoned Cart Reminders', enabled: true },
        { name: 'Discount Code Application', enabled: true },
        { name: 'Guest Checkout', enabled: false },
    ];

    const abandonedCarts = [
        { user: 'customer1@example.com', items: 3, value: '$125.50', time: '2 hours ago' },
        { user: 'guest_user_123', items: 1, value: '$49.99', time: '5 hours ago' },
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
                <h1 className="text-3xl font-bold">Shopping Cart Management</h1>
                <p className="text-muted-foreground">Manage shopping cart functionality for merchants.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cart Features Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {features.map(feature => (
                        <div key={feature.name} className="flex items-center justify-between">
                            <Label htmlFor={feature.name.replace(/\s+/g, '-').toLowerCase()}>{feature.name}</Label>
                            <div className="flex items-center space-x-2">
                                <Switch id={feature.name.replace(/\s+/g, '-').toLowerCase()} defaultChecked={feature.enabled} />
                                <Button variant="ghost" size="icon" onClick={handleAction}><Edit className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Abandoned Carts Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {abandonedCarts.map((cart, index) => (
                                <TableRow key={index}>
                                    <TableCell>{cart.user}</TableCell>
                                    <TableCell>{cart.items}</TableCell>
                                    <TableCell>{cart.value}</TableCell>
                                    <TableCell>{cart.time}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={handleAction}>
                                            <Bell className="mr-2 h-4 w-4" /> Trigger Reminder
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

export default AdminShoppingCartManagementPage;