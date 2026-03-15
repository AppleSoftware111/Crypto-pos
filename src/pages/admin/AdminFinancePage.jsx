import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, IndianRupee, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminFinancePage = () => {
    const { toast } = useToast();

    const reports = [
        { name: 'Revenue Report', period: 'Q2 2025', status: 'Generated' },
        { name: 'Expense Report', period: 'June 2025', status: 'Pending' },
        { name: 'Profit & Loss Statement', period: 'YTD 2025', status: 'Generated' },
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
                <h1 className="text-3xl font-bold">Finance Department</h1>
                <p className="text-muted-foreground">Manage financial transactions and reports for OMARA.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Financial Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Name</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.name}>
                                    <TableCell className="font-medium">{report.name}</TableCell>
                                    <TableCell>{report.period}</TableCell>
                                    <TableCell>{report.status}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={handleAction}>
                                            <Download className="h-4 w-4" />
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
                        <CardTitle>Billing & Invoicing</CardTitle>
                        <CardDescription>Generate and manage invoices.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleAction} variant="secondary">
                            <FileText className="mr-2 h-4 w-4" /> Manage Invoices
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payout Management</CardTitle>
                        <CardDescription>Oversee payouts to partners.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleAction} variant="secondary">
                            <IndianRupee className="mr-2 h-4 w-4" /> Manage Payouts
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminFinancePage;