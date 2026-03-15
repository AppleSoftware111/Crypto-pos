import React from 'react';
import { useDigitalBalance } from '@/context/DigitalBalanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminComplianceRiskPage = () => {
    const { frozenAccounts, toggleFreezeAccount } = useDigitalBalance();
    
    // Mock user list
    const users = ['user@example.com', 'risk@user.com'];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Compliance & Risk</h1>
            <Card>
                <CardHeader><CardTitle>User Risk Status</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(u => {
                                const isFrozen = frozenAccounts.includes(u);
                                return (
                                    <TableRow key={u}>
                                        <TableCell>{u}</TableCell>
                                        <TableCell>
                                            <Badge variant={isFrozen ? 'destructive' : 'success'}>
                                                {isFrozen ? 'Frozen' : 'Active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                size="sm" 
                                                variant={isFrozen ? 'outline' : 'destructive'}
                                                onClick={() => toggleFreezeAccount(u, 'Manual Risk Review', 'Admin')}
                                            >
                                                {isFrozen ? 'Unfreeze' : 'Freeze Account'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
export default AdminComplianceRiskPage;