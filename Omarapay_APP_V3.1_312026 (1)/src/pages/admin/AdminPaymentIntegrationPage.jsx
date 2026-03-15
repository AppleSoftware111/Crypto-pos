import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings, TestTube2, Power } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminPaymentIntegrationPage = () => {
    const { toast } = useToast();

    const gateways = [
        { name: 'Visa/Mastercard (Stripe)', status: 'Active', lastSync: 'Just now', currencies: 'USD, PHP, AED', types: 'Card' },
        { name: 'GCash', status: 'Active', lastSync: '1 min ago', currencies: 'PHP', types: 'Digital Wallet' },
        { name: 'Alipay', status: 'Inactive', lastSync: '2 days ago', currencies: 'CNY', types: 'Digital Wallet' },
        { name: 'Crypto Processor (Coinbase)', status: 'Active', lastSync: '30 secs ago', currencies: 'BTC, ETH, USDFX', types: 'Crypto' },
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
                <h1 className="text-3xl font-bold">Payment Integration</h1>
                <p className="text-muted-foreground">Manage all supported payment gateways and methods.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Integrated Gateways</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Gateway Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Sync</TableHead>
                                <TableHead>Supported Currencies</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gateways.map((gateway) => (
                                <TableRow key={gateway.name}>
                                    <TableCell className="font-medium">{gateway.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={gateway.status === 'Active' ? 'success' : 'secondary'}>{gateway.status}</Badge>
                                    </TableCell>
                                    <TableCell>{gateway.lastSync}</TableCell>
                                    <TableCell>{gateway.currencies}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="icon" onClick={handleAction}><Settings className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="icon" onClick={handleAction}><TestTube2 className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="icon" onClick={handleAction}><Power className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction Monitoring</CardTitle>
                    <CardDescription>Real-time feed of payment transactions. (Coming Soon)</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground h-32 flex items-center justify-center">
                    <p>Live transaction feed will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminPaymentIntegrationPage;