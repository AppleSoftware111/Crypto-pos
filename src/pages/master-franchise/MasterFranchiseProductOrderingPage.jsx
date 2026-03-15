import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const products = [
    { id: 1, name: 'OMARA MPOS Terminal', description: 'Mobile Point-of-Sale device for seamless transactions.', price: 299.00, stock: 50 },
    { id: 2, name: 'OMARA DPOS License', description: 'Digital POS software license for one year.', price: 99.00, stock: 1000 },
    { id: 3, name: 'OMARA SAVE Subscription', description: '1-year subscription to our savings and rewards program.', price: 49.00, stock: 1000 },
];

const MasterFranchiseProductOrderingPage = () => {
    const { toast } = useToast();

    const handleOrder = () => {
        toast({
            title: "Order Placed",
            description: "Your order has been submitted for processing.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Product Ordering</h1>
                <p className="text-muted-foreground">Order OMARA products for your inventory.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <Card key={product.id}>
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Available Stock: {product.stock}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                                <span className="font-bold text-lg">1</span>
                                <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
                            </div>
                            <Button><ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            
            <div className="flex justify-end">
                <Button size="lg" onClick={handleOrder}>Place Order</Button>
            </div>
        </div>
    );
};

export default MasterFranchiseProductOrderingPage;