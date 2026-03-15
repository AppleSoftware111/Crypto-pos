import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MapPin, KeyRound } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PosManagementPage = () => {
    const { toast } = useToast();

    const posMachines = [
        { id: 'POS-001', location: 'Main Counter', status: 'Online', salesToday: '$1,250.75' },
        { id: 'POS-002', location: 'Drive-Thru', status: 'Online', salesToday: '$875.50' },
        { id: 'POS-003', location: 'Upstairs Cafe', status: 'Offline', salesToday: '$0.00' },
    ];

    const handleAction = (feature) => {
        toast({
            title: "🚧 Feature in Progress",
            description: `${feature} will be available soon!`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">POS Management</h1>
                    <p className="text-muted-foreground">Configure and monitor your Point-of-Sale terminals.</p>
                </div>
                <Button onClick={() => handleAction('Registering new POS hardware')}><PlusCircle className="mr-2 h-4 w-4" /> Register POS Hardware</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Monitor Sales per Machine</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Machine ID</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Sales Today</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posMachines.map((machine) => (
                                <TableRow key={machine.id}>
                                    <TableCell className="font-mono">{machine.id}</TableCell>
                                    <TableCell>{machine.location}</TableCell>
                                    <TableCell>
                                        <Badge variant={machine.status === 'Online' ? 'success' : 'destructive'}>{machine.status}</Badge>
                                    </TableCell>
                                    <TableCell>{machine.salesToday}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configure POS Settings</CardTitle>
                        <CardDescription>Define payment methods, currency, and receipt formats.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Accept Credit Cards</Label>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Accept Crypto</Label>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Accept Digital Wallets</Label>
                            <Switch defaultChecked />
                        </div>
                        <Button className="w-full mt-2" onClick={() => handleAction('Saving POS settings')}>Save Settings</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Licensing & Locations</CardTitle>
                        <CardDescription>Manage licenses and branch registrations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="licensingKey">Add POS Licensing Key</Label>
                            <Input id="licensingKey" placeholder="Enter key..." />
                        </div>
                        <Button className="w-full" onClick={() => handleAction('Adding licensing key')}><KeyRound className="mr-2 h-4 w-4" /> Add Key</Button>
                        <Button variant="secondary" className="w-full" onClick={() => handleAction('Registering a new branch')}><MapPin className="mr-2 h-4 w-4" /> Register New Branch</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PosManagementPage;