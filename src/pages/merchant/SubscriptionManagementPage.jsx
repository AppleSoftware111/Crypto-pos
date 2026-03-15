import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SubscriptionManagementPage = () => {
    const { toast } = useToast();

    const handleAction = (feature) => {
        toast({
            title: "🚧 Feature in Progress",
            description: `${feature} will be available soon!`,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Subscription Management</h1>
                <p className="text-muted-foreground">Manage your subscriptions to OMARA services.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><ShoppingCart className="mr-2 h-5 w-5" /> Omara Shopping Cart</CardTitle>
                        <CardDescription>Your current plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Unlimited Products</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Advanced Analytics</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 24/7 Support</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" onClick={() => handleAction('Changing subscription plan')}>Change Plan</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Your primary payment method for subscriptions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Visa ending in **** 1234</p>
                        <p className="text-sm text-muted-foreground">Next billing date: August 1, 2025</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleAction('Updating payment method')}>Update Payment Method</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SubscriptionManagementPage;