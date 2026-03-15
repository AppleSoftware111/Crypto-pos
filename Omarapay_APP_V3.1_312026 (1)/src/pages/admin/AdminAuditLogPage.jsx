import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminAuditLogPage = () => {

    const logs = [
        { id: 1, user: 'admin@omarapay.com', action: 'Updated user status', target: 'Bob Williams (ID: 2)', status: 'Success', date: '2025-07-17 10:30 AM' },
        { id: 2, user: 'Alice Johnson', action: 'Failed login attempt', target: 'User Login', status: 'Failure', date: '2025-07-17 09:15 AM' },
        { id: 3, user: 'admin@omarapay.com', action: 'Accessed Admin Dashboard', target: 'Dashboard', status: 'Success', date: '2025-07-17 09:00 AM' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Audit Log</h1>
                <p className="text-muted-foreground">A searchable log of all user actions and system events.</p>
            </div>
            
             <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input placeholder="Search logs by user, action, or target..." className="pl-10" />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">{log.user}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>{log.target}</TableCell>
                                    <TableCell>
                                        <Badge variant={log.status === 'Success' ? 'success' : 'destructive'}>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{log.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAuditLogPage;