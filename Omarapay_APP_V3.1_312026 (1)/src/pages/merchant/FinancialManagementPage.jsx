import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, Bitcoin, Users, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FinancialManagementPage = () => {
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
                <h1 className="text-3xl font-bold">Financial Management</h1>
                <p className="text-muted-foreground">Handle your business's financial transactions and processes.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Bank Account</CardTitle>
                        <CardDescription>Link your business bank accounts for payouts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" placeholder="Enter account number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="routingNumber">Routing Number</Label>
                            <Input id="routingNumber" placeholder="Enter routing number" />
                        </div>
                        <Button className="w-full" onClick={() => handleAction('Adding a bank account')}><Landmark className="mr-2 h-4 w-4" /> Link Account</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Crypto Withdrawals</CardTitle>
                        <CardDescription>Request and track crypto withdrawals to external wallets.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="walletAddress">Wallet Address</Label>
                            <Input id="walletAddress" placeholder="Enter crypto wallet address" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (FXT)</Label>
                            <Input id="amount" type="number" placeholder="Enter amount" />
                        </div>
                        <Button className="w-full" onClick={() => handleAction('Withdrawing crypto')}><Bitcoin className="mr-2 h-4 w-4" /> Request Withdrawal</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>More Financial Tools</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                    <Button variant="secondary" className="w-full justify-start p-6 text-left h-auto" onClick={() => handleAction('Payroll Management')}>
                        <Users className="mr-4 h-6 w-6" />
                        <div>
                            <p className="font-semibold">Payroll Management</p>
                            <p className="text-xs text-muted-foreground">Calculate and process employee payroll.</p>
                        </div>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start p-6 text-left h-auto" onClick={() => handleAction('Payments to other merchants')}>
                        <FileText className="mr-4 h-6 w-6" />
                        <div>
                            <p className="font-semibold">Pay Other Merchants</p>
                            <p className="text-xs text-muted-foreground">Send payments within the OMARA network.</p>
                        </div>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default FinancialManagementPage;