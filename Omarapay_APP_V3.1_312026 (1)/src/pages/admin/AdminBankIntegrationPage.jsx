import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminBankIntegrationPage = () => {
    const { toast } = useToast();

    const accounts = [
        { bank: 'BDO Unibank', account: '**** **** 1234', currency: 'PHP', status: 'Connected' },
        { bank: 'Emirates NBD', account: '**** **** 5678', currency: 'AED', status: 'Connected' },
        { bank: 'Citibank', account: '**** **** 9012', currency: 'USD', status: 'Disconnected' },
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
                    <h1 className="text-3xl font-bold">Bank Integration</h1>
                    <p className="text-muted-foreground">Manage direct integrations with banking services.</p>
                </div>
                <Button onClick={handleAction}><PlusCircle className="mr-2 h-4 w-4" /> Add New Account</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Linked Bank Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bank Name</TableHead>
                                <TableHead>Account Number</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map((account) => (
                                <TableRow key={account.bank}>
                                    <TableCell className="font-medium">{account.bank}</TableCell>
                                    <TableCell>{account.account}</TableCell>
                                    <TableCell>{account.currency}</TableCell>
                                    <TableCell>
                                        <Badge variant={account.status === 'Connected' ? 'success' : 'secondary'}>{account.status}</Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="icon" onClick={handleAction}><Settings className="h-4 w-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={handleAction}><Trash2 className="h-4 w-4" /></Button>
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

export default AdminBankIntegrationPage;