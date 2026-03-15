import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const MasterFranchiseSubscriptionPage = () => {
    const { toast } = useToast();

    const handleCreateDiscount = (e) => {
        e.preventDefault();
        toast({
            title: "Discount Created",
            description: "The new discount has been created successfully.",
        });
        e.target.reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Merchant Subscription</h1>
                <p className="text-muted-foreground">Facilitate subscriptions and offer discounts.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>On-the-Spot Merchant Registration</CardTitle>
                    <CardDescription>Quickly onboard a new merchant from here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link to="/master-franchise/merchants/register">Register New Merchant</Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Customized Discounts</CardTitle>
                    <CardDescription>Create special discounts for your merchants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateDiscount} className="space-y-4 max-w-md">
                        <div className="space-y-2"><Label htmlFor="discount-name">Discount Name</Label><Input id="discount-name" placeholder="e.g., Summer Sale" required /></div>
                        <div className="space-y-2"><Label htmlFor="discount-value">Value (% or Fixed)</Label><Input id="discount-value" placeholder="e.g., 10 or 10%" required /></div>
                        <div className="space-y-2"><Label htmlFor="discount-merchant">Apply to (Merchant ID or "All")</Label><Input id="discount-merchant" placeholder="merchant-xyz or All" required/></div>
                        <div className="space-y-2"><Label htmlFor="discount-validity">Validity (End Date)</Label><Input id="discount-validity" type="date" required/></div>
                        <Button type="submit">Create Discount</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseSubscriptionPage;