import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings, ExternalLink, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminBlockchainIntegrationPage = () => {
    const { toast } = useToast();

    const networks = [
        { name: 'Ethereum', status: 'Connected', lastBlock: '19238491', nodeHealth: 'Healthy' },
        { name: 'Bitcoin', status: 'Connected', lastBlock: '823491', nodeHealth: 'Healthy' },
        { name: 'Binance Smart Chain', status: 'Disconnected', lastBlock: '34918234', nodeHealth: 'Unreachable' },
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
                <h1 className="text-3xl font-bold">Blockchain Integration</h1>
                <p className="text-muted-foreground">Manage connections to blockchain networks and oversee crypto transactions.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Blockchain Network Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Network Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Block Synced</TableHead>
                                <TableHead>Node Health</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {networks.map((network) => (
                                <TableRow key={network.name}>
                                    <TableCell className="font-medium">{network.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={network.status === 'Connected' ? 'success' : 'destructive'}>{network.status}</Badge>
                                    </TableCell>
                                    <TableCell>{network.lastBlock}</TableCell>
                                    <TableCell>
                                        <Badge variant={network.nodeHealth === 'Healthy' ? 'success' : 'destructive'}>{network.nodeHealth}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={handleAction}>
                                            <Settings className="mr-2 h-4 w-4" /> Configure
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Smart Contract Management</CardTitle>
                        <CardDescription>Deploy and monitor OMARA's smart contracts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleAction} variant="secondary">Manage Contracts</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Internal Wallet Management</CardTitle>
                        <CardDescription>Overview of OMARA's operational wallets.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleAction} variant="secondary"><Wallet className="mr-2 h-4 w-4" /> View Wallets</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminBlockchainIntegrationPage;