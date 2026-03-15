import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Shield, User, Briefcase, PlusCircle, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminRolesPage = () => {
    const { toast } = useToast();

    const roles = [
        { name: 'Super Admin', description: 'Full access to the entire system.', users: 1, icon: <Shield /> },
        { name: 'Master Franchise', description: 'Manages a group of merchants.', users: 5, icon: <Briefcase /> },
        { name: 'Merchant', description: 'Standard user for business transactions.', users: 150, icon: <User /> },
        { name: 'Affiliate', description: 'Manages referral links and commissions.', users: 30, icon: <User /> },
        { name: 'Normal User', description: 'Customer-level account.', users: 2500, icon: <User /> },
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
                    <h1 className="text-3xl font-bold">Role Management</h1>
                    <p className="text-muted-foreground">Define and manage user roles and their permissions.</p>
                </div>
                <Button onClick={handleAction}><PlusCircle className="mr-2 h-4 w-4" /> Create New Role</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Predefined Roles</CardTitle>
                    <CardDescription>System roles with their assigned user counts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Users</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.name}>
                                    <TableCell className="font-medium flex items-center">
                                        <span className="mr-2">{role.icon}</span>{role.name}
                                    </TableCell>
                                    <TableCell>{role.description}</TableCell>
                                    <TableCell>{role.users}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={handleAction}>
                                            <Settings className="mr-2 h-4 w-4" /> View Permissions
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
                    <CardTitle>Permission Matrix Editor</CardTitle>
                    <CardDescription>A detailed interface to define granular permissions for each role. (Coming soon)</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    <p>The permission matrix will allow you to assign specific actions (e.g., "view reports", "edit products") to each role.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminRolesPage;