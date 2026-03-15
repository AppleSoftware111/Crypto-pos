import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, RefreshCw, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

const CrmPage = () => {
    const { toast } = useToast();

    const customers = [
        { id: 'CUST001', phone: '+1-555-123-4567', lastSale: '2025-07-18', totalSpent: '$250.00' },
        { id: 'CUST002', phone: '+1-555-987-6543', lastSale: '2025-07-15', totalSpent: '$120.50' },
        { id: 'CUST003', phone: '+1-555-456-7890', lastSale: '2025-07-12', totalSpent: '$80.00' },
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
                    <h1 className="text-3xl font-bold">CRM System</h1>
                    <p className="text-muted-foreground">Manage your customer relationships and interactions.</p>
                </div>
                <Button onClick={() => handleAction('Adding a new customer')}><UserPlus className="mr-2 h-4 w-4" /> Add Customer</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>List of Customers</CardTitle>
                    <CardDescription>Search and manage your customers.</CardDescription>
                    <div className="pt-2">
                        <Input placeholder="Search by phone number..." />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer ID</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Last Sale</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-mono">{customer.id}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.lastSale}</TableCell>
                                    <TableCell>{customer.totalSpent}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleAction('Viewing profile')}>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction('Processing a refund')}><RefreshCw className="mr-2 h-4 w-4" /> Process Refund</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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

export default CrmPage;