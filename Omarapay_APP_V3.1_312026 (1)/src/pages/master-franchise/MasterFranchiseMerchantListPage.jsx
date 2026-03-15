import React from 'react';
import { useUsers } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, UserPlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const MasterFranchiseMerchantListPage = () => {
    const { users } = useUsers();
    const merchants = users.filter(u => u.role === 'Merchant');
    const { toast } = useToast();

    const handleAction = (action) => {
        toast({
            title: "Action Triggered",
            description: `${action} feature coming soon.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Merchant Listing</h1>
                    <p className="text-muted-foreground">Oversee and manage your onboarded merchants.</p>
                </div>
                <Button asChild>
                    <Link to="/master-franchise/merchants/register">
                        <UserPlus className="mr-2 h-4 w-4" /> Register New Merchant
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Merchants</CardTitle>
                    <CardDescription>A list of all merchants under your jurisdiction.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Business Name</TableHead>
                                <TableHead>Contact Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Onboarding Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {merchants.map((merchant) => (
                                <TableRow key={merchant.id}>
                                    <TableCell className="font-medium">{merchant.businessName}</TableCell>
                                    <TableCell>{merchant.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={merchant.status === 'Approved' ? 'success' : (merchant.status === 'Pending' ? 'warning' : 'destructive')}>
                                            {merchant.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{merchant.joined}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleAction('View Profile')}>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction('View Transactions')}>View Transactions</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction('Set Fees')}>Set Fees</DropdownMenuItem>
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

export default MasterFranchiseMerchantListPage;