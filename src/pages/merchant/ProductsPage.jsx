import React from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit2 } from 'lucide-react';

const ProductsPage = () => {
    const { products, loading, isModeDemo } = useMerchant();

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products & Services</h2>
                    <p className="text-muted-foreground">
                        {isModeDemo() ? "Manage your demo catalog." : "Manage your catalog items."}
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Catalog</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total Sold</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">No products found.</TableCell>
                                </TableRow>
                            ) : (
                                products.map((prod) => (
                                    <TableRow key={prod.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {prod.name}
                                                    {prod.isDemo && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1 rounded">DEMO</span>}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{prod.description}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>${prod.price}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{prod.status}</Badge>
                                        </TableCell>
                                        <TableCell>{prod.totalSold}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
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

export default ProductsPage;