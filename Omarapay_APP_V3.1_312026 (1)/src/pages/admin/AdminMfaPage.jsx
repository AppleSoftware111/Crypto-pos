import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Smartphone, Mail, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminMfaPage = () => {
    const { toast } = useToast();

    const policies = [
        { role: 'Super Admin', requirement: 'Mandatory', methods: 'Authenticator App' },
        { role: 'Master Franchise', requirement: 'Mandatory', methods: 'Authenticator App, SMS OTP' },
        { role: 'Merchant', requirement: 'Optional', methods: 'Authenticator App, SMS OTP, Email OTP' },
    ];
    
    const users = [
        { user: 'admin@omara.com', status: 'Enabled' },
        { user: 'franchise.uae@email.com', status: 'Enabled' },
        { user: 'merchant.shop@email.com', status: 'Disabled' },
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
                <h1 className="text-3xl font-bold">Multi-Factor Authenticator</h1>
                <p className="text-muted-foreground">Manage and enforce Multi-Factor Authentication (MFA) settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>MFA Policy</CardTitle>
                    <CardDescription>Define which roles require MFA and the available methods.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>MFA Requirement</TableHead>
                                <TableHead>Enabled Methods</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {policies.map((policy) => (
                                <TableRow key={policy.role}>
                                    <TableCell className="font-medium">{policy.role}</TableCell>
                                    <TableCell><Badge variant={policy.requirement === 'Mandatory' ? 'destructive' : 'default'}>{policy.requirement}</Badge></TableCell>
                                    <TableCell>{policy.methods}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={handleAction}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>User MFA Status</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>MFA Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.user}>
                                    <TableCell>{user.user}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'Enabled' ? 'success' : 'secondary'}>{user.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={handleAction}>
                                            Reset MFA
                                        </Button>
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

export default AdminMfaPage;