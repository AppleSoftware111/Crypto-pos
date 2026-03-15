import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

const AdminAffiliateManagementPage = () => {
    const { toast } = useToast();

    const affiliates = [
        { id: 'AFF-001', name: 'Crypto Influencer', email: 'influencer@crypto.com', code: 'CRYPTO10', status: 'Active', referrals: 150, commissions: '$2,500' },
        { id: 'AFF-002', name: 'Tech Blogger', email: 'blogger@tech.com', code: 'TECHDEAL', status: 'Active', referrals: 85, commissions: '$1,200' },
        { id: 'AFF-003', name: 'Marketing Agency', email: 'agency@market.com', code: 'PARTNERUP', status: 'Inactive', referrals: 20, commissions: '$300' },
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
                    <h1 className="text-3xl font-bold">Affiliate Management</h1>
                    <p className="text-muted-foreground">Manage and track all affiliate partnerships.</p>
                </div>
                <Button onClick={handleAction}><PlusCircle className="mr-2 h-4 w-4" /> Onboard New Affiliate</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Affiliate List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Affiliate ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Referrals</TableHead>
                                <TableHead>Commissions</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {affiliates.map((affiliate) => (
                                <TableRow key={affiliate.id}>
                                    <TableCell className="font-mono">{affiliate.id}</TableCell>
                                    <TableCell>{affiliate.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={affiliate.status === 'Active' ? 'success' : 'secondary'}>{affiliate.status}</Badge>
                                    </TableCell>
                                    <TableCell>{affiliate.referrals}</TableCell>
                                    <TableCell>{affiliate.commissions}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={handleAction}>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem onClick={handleAction}>Process Payout</DropdownMenuItem>
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

export default AdminAffiliateManagementPage;