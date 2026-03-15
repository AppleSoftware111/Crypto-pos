import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Package, ShoppingCart, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminWebCommercePage = () => {
    const { toast } = useToast();

    const settings = [
        { name: 'Store Name', value: 'OMARA Official Store' },
        { name: 'Contact Email', value: 'store@omara.com' },
        { name: 'Payment Methods', value: 'Card, Crypto' },
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
                <h1 className="text-3xl font-bold">Web Commerce & Shop</h1>
                <p className="text-muted-foreground">Handle and configure e-commerce functionalities.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Online Store Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Setting Name</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {settings.map((setting) => (
                                <TableRow key={setting.name}>
                                    <TableCell className="font-medium">{setting.name}</TableCell>
                                    <TableCell>{setting.value}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="icon" onClick={handleAction}><Edit className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center justify-center p-6">
                    <Package className="h-12 w-12 text-primary mb-4" />
                    <Button onClick={handleAction}>Manage Products</Button>
                </Card>
                <Card className="flex flex-col items-center justify-center p-6">
                    <ShoppingCart className="h-12 w-12 text-primary mb-4" />
                    <Button onClick={handleAction}>Configure Cart</Button>
                </Card>
                <Card className="flex flex-col items-center justify-center p-6">
                    <Truck className="h-12 w-12 text-primary mb-4" />
                    <Button onClick={handleAction}>Manage Orders</Button>
                </Card>
            </div>
        </div>
    );
};

export default AdminWebCommercePage;