import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminCryptocurrencyListingPage = () => {
    const { toast } = useToast();

    const cryptos = [
        { symbol: 'BTC', name: 'Bitcoin', rate: '$65,432.10', status: 'Active', networks: 'Bitcoin' },
        { symbol: 'ETH', name: 'Ethereum', rate: '$3,456.78', status: 'Active', networks: 'Ethereum' },
        { symbol: 'USDFX', name: 'USD FX Token', rate: '$1.00', status: 'Active', networks: 'Ethereum, BSC' },
        { symbol: 'XRP', name: 'Ripple', rate: '$0.52', status: 'Inactive', networks: 'Ripple' },
    ];

    const handleAction = () => {
        toast({
            title: "🚧 Feature in Progress",
            description: "This functionality is coming soon!",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Cryptocurrency Listing</h1>
                    <p className="text-muted-foreground">Manage the cryptocurrencies available for transactions.</p>
                </div>
                <Button onClick={handleAction}><PlusCircle className="mr-2 h-4 w-4" /> Add New Cryptocurrency</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listed Cryptocurrencies</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Current Exchange Rate</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Supported Networks</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cryptos.map((crypto) => (
                                <TableRow key={crypto.symbol}>
                                    <TableCell className="font-medium">{crypto.symbol}</TableCell>
                                    <TableCell>{crypto.name}</TableCell>
                                    <TableCell>{crypto.rate}</TableCell>
                                    <TableCell>
                                        <Badge variant={crypto.status === 'Active' ? 'success' : 'secondary'}>{crypto.status}</Badge>
                                    </TableCell>
                                    <TableCell>{crypto.networks}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="icon" onClick={handleAction}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="icon" onClick={handleAction}><RefreshCw className="h-4 w-4" /></Button>
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

export default AdminCryptocurrencyListingPage;