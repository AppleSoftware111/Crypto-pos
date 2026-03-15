import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, ShieldQuestion } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminApprovalPasswordsPage = () => {
    const { toast } = useToast();

    const policies = [
        { action: 'Refund > $1,000', requiredBy: 'Super Admin, Finance Lead', type: 'Admin Master', status: 'Active' },
        { action: 'Change User Role', requiredBy: 'Super Admin', type: 'Admin Master', status: 'Active' },
        { action: 'Deactivate Merchant', requiredBy: 'Team Manager', type: 'Team Password', status: 'Inactive' },
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
                    <h1 className="text-3xl font-bold">Approval Passwords</h1>
                    <p className="text-muted-foreground">Require passwords for critical platform actions.</p>
                </div>
                 <Button onClick={handleAction}><PlusCircle className="mr-2 h-4 w-4" /> Add New Policy</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Policy Configuration</CardTitle>
                    <CardDescription>Define when an approval password is required.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Required By</TableHead>
                                <TableHead>Password Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {policies.map((policy) => (
                                <TableRow key={policy.action}>
                                    <TableCell className="font-medium">{policy.action}</TableCell>
                                    <TableCell>{policy.requiredBy}</TableCell>
                                    <TableCell>{policy.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={policy.status === 'Active' ? 'success' : 'secondary'}>{policy.status}</Badge>
                                    </TableCell>
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
                    <CardTitle>Password Management</CardTitle>
                    <CardDescription>Securely manage master and team passwords.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleAction} variant="secondary">
                        <ShieldQuestion className="mr-2 h-4 w-4" /> Manage Passwords
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminApprovalPasswordsPage;