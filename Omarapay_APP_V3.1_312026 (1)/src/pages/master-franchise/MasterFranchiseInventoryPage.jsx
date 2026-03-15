import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PackagePlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const inventory = [
    { id: 1, name: 'OMARA MPOS Terminal', stock: 25, location: 'Main Warehouse' },
    { id: 2, name: 'OMARA DPOS License Codes', stock: 150, location: 'Digital Vault' },
];

const MasterFranchiseInventoryPage = () => {
    const { toast } = useToast();

    const handleRestock = () => {
        toast({
            title: "Restock Request Sent",
            description: "Your request for restocking has been sent to the Super Admin.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Inventory Management</h1>
                    <p className="text-muted-foreground">Manage your local stock of OMARA products.</p>
                </div>
                <Button onClick={handleRestock}><PackagePlus className="mr-2 h-4 w-4" /> Request Restock</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Inventory</CardTitle>
                    <CardDescription>Current stock levels for products you can sell to merchants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.stock}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">Update Stock</Button>
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

export default MasterFranchiseInventoryPage;