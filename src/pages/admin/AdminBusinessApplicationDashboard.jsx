import React from 'react';
import { useUsers } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, FileText } from 'lucide-react';

const AdminBusinessApplicationDashboard = () => {
  const { businessApplications, updateApplicationStatus } = useUsers();

  return (
    <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Business Applications</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Application ID</TableHead>
                            <TableHead>Business Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Wallet Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {businessApplications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            businessApplications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-mono font-medium">{app.id}</TableCell>
                                    <TableCell>{app.businessName}</TableCell>
                                    <TableCell>{app.type}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {app.walletAddress?.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            app.status === 'Approved' ? 'success' : 
                                            app.status === 'Rejected' ? 'destructive' : 'secondary'
                                        }>
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {app.status === 'Pending' && (
                                            <>
                                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => updateApplicationStatus(app.id, 'Approved')}>
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => updateApplicationStatus(app.id, 'Rejected')}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                        <Button size="sm" variant="ghost">
                                            <FileText className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
};

export default AdminBusinessApplicationDashboard;