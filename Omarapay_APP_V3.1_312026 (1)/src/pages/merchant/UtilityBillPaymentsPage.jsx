import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Zap, Lightbulb } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UtilityBillPaymentsPage = () => {
    const { toast } = useToast();

    const paymentHistory = [
        { id: 'PAY-001', date: '2025-07-15', biller: 'Meralco Electric', amount: '$150.00', status: 'Paid' },
        { id: 'PAY-002', date: '2025-07-10', biller: 'Manila Water', amount: '$45.50', status: 'Paid' },
        { id: 'PAY-003', date: '2025-06-15', biller: 'Meralco Electric', amount: '$145.20', status: 'Paid' },
    ];

    const handleAction = (feature) => {
        toast({
            title: "🚧 Feature in Progress",
            description: `${feature} will be available soon!`,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Utility Bill Payments</h1>
                <p className="text-muted-foreground">Conveniently manage and pay your business's utility bills.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Pay a Bill</CardTitle>
                        <CardDescription>Select a biller and make a payment.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="biller">Select Biller</Label>
                            <Input id="biller" placeholder="Search for a biller (e.g., Meralco)" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" placeholder="Enter your account number" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" type="number" placeholder="Enter amount to pay" />
                        </div>
                        <Button className="w-full" onClick={() => handleAction('Paying a utility bill')}><Zap className="mr-2 h-4 w-4" /> Pay Now</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Scheduled Payments</CardTitle>
                        <CardDescription>Set up automatic bill payments.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-full text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">Automate your bill payments so you never miss a due date.</p>
                        <Button variant="secondary" onClick={() => handleAction('Scheduling payments')}>Schedule a Payment</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Biller</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentHistory.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.date}</TableCell>
                                    <TableCell>{payment.biller}</TableCell>
                                    <TableCell>
                                        <Badge variant="success">{payment.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{payment.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default UtilityBillPaymentsPage;