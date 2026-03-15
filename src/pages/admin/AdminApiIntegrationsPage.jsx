import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings, TestTube2, KeyRound } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminApiIntegrationsPage = () => {
    const { toast } = useToast();

    const apis = [
        { name: 'Twilio SMS Gateway', provider: 'Twilio', status: 'Active', keyStatus: 'Valid', lastSync: 'Just now' },
        { name: 'SendGrid Email Service', provider: 'SendGrid', status: 'Active', keyStatus: 'Valid', lastSync: '1 min ago' },
        { name: 'Shufti Pro KYC/KYB', provider: 'Shufti Pro', status: 'Active', keyStatus: 'Expires in 30 days', lastSync: '5 mins ago' },
        { name: 'Google Analytics', provider: 'Google', status: 'Inactive', keyStatus: 'Invalid', lastSync: '1 day ago' },
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
                <h1 className="text-3xl font-bold">API Integrations</h1>
                <p className="text-muted-foreground">Manage integrations with external APIs.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>External API List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Integration Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>API Key Status</TableHead>
                                <TableHead>Last Sync</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apis.map((api) => (
                                <TableRow key={api.name}>
                                    <TableCell className="font-medium">{api.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={api.status === 'Active' ? 'success' : 'secondary'}>{api.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={api.keyStatus === 'Valid' ? 'success' : 'destructive'}>{api.keyStatus}</Badge>
                                    </TableCell>
                                    <TableCell>{api.lastSync}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="icon" onClick={handleAction}><Settings className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="icon" onClick={handleAction}><TestTube2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>API Key Management</CardTitle>
                    <CardDescription>Securely store and rotate API keys.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleAction} variant="secondary">
                        <KeyRound className="mr-2 h-4 w-4" /> Manage API Keys
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminApiIntegrationsPage;