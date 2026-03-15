import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const MasterFranchiseFinancialServicesPage = () => {
    const { toast } = useToast();

    const handleAction = (title) => {
        toast({
            title,
            description: "Service has been processed successfully.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Financial Services</h1>
                <p className="text-muted-foreground">Access financial tools for your operations.</p>
            </div>

            <Tabs defaultValue="top-up" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="top-up">Top-Up FX Credit</TabsTrigger>
                    <TabsTrigger value="crypto-sales">Crypto Sales</TabsTrigger>
                    <TabsTrigger value="remittance">Remittance</TabsTrigger>
                    <TabsTrigger value="utility-bills">Utility Bills</TabsTrigger>
                </TabsList>

                <TabsContent value="top-up">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top-Up FX Credit</CardTitle>
                            <CardDescription>Convert cash from merchants/users to FX Credit.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="topup-amount">Fiat Amount</Label><Input id="topup-amount" type="number" placeholder="e.g., 1000" /></div>
                            <div className="space-y-2"><Label htmlFor="topup-recipient">Recipient Merchant/User ID</Label><Input id="topup-recipient" placeholder="e.g., user-123" /></div>
                            <Button onClick={() => handleAction('Top-Up Successful')}>Initiate Top-Up</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="crypto-sales">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crypto Sales</CardTitle>
                            <CardDescription>Sell crypto from your inventory for fiat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="crypto-amount">Fiat Amount</Label><Input id="crypto-amount" type="number" placeholder="e.g., 500" /></div>
                            <div className="space-y-2"><Label htmlFor="crypto-type">Crypto Type</Label><Input id="crypto-type" placeholder="e.g., BTC, ETH" /></div>
                            <div className="space-y-2"><Label htmlFor="crypto-wallet">Recipient Wallet Address</Label><Input id="crypto-wallet" /></div>
                             <Button onClick={() => handleAction('Crypto Sale Successful')}>Initiate Crypto Sale</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="remittance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Remittance Support</CardTitle>
                            <CardDescription>Facilitate remittance services.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <p>Remittance features are coming soon.</p>
                           <Button disabled>Coming Soon</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="utility-bills">
                    <Card>
                        <CardHeader>
                            <CardTitle>Utility Bill Payments</CardTitle>
                            <CardDescription>Pay utility bills for your clients.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="biller">Biller Name</Label><Input id="biller" placeholder="e.g., Meralco" /></div>
                            <div className="space-y-2"><Label htmlFor="account-no">Account Number</Label><Input id="account-no" /></div>
                            <div className="space-y-2"><Label htmlFor="bill-amount">Amount</Label><Input id="bill-amount" type="number" /></div>
                            <Button onClick={() => handleAction('Utility Bill Paid')}>Pay Bill</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
             <Card>
                <CardHeader>
                    <CardTitle>OMARA Product Orders</CardTitle>
                    <CardDescription>Access the internal shopping cart to order OMARA products for your inventory.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link to="/master-franchise/products/order">Go to Product Ordering</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseFinancialServicesPage;