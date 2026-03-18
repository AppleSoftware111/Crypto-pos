import React from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    DollarSign, 
    CreditCard, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight, 
    Users,
    Activity,
    Wallet,
    Receipt,
    Coins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { POS_ENABLED } from '@/config/posConfig';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const MerchantDashboardPage = () => {
    const { analytics, transactions, loading, isModeDemo } = useMerchant();
    const navigate = useNavigate();

    if (loading) return <div className="p-8">Loading Dashboard...</div>;

    // Use zeroed out stats if no analytics data (Live mode with no data)
    const stats = [
        { 
            title: "Total Revenue", 
            value: `$${(analytics?.revenue?.total || 0).toLocaleString()}`, 
            icon: DollarSign, 
            trend: analytics?.revenue?.trend ? `+${analytics.revenue.trend}%` : "0%", 
            trendUp: true,
            color: "text-green-600 bg-green-100"
        },
        { 
            title: "Transactions", 
            value: (analytics?.transactions?.total || 0).toLocaleString(), 
            icon: CreditCard, 
            trend: analytics?.transactions?.trend ? `+${analytics.transactions.trend}%` : "0%", 
            trendUp: true,
            color: "text-blue-600 bg-blue-100"
        },
        { 
            title: "Customers", 
            value: (analytics?.customers?.total || 0).toLocaleString(), 
            icon: Users, 
            trend: analytics?.customers?.trend ? `+${analytics.customers.trend}%` : "0%", 
            trendUp: true,
            color: "text-orange-600 bg-orange-100"
        },
        { 
            title: "Active Balance", 
            value: "$0.00", // Need real balance context eventually
            icon: Wallet, 
            trend: "Available", 
            trendUp: true,
            color: "text-purple-600 bg-purple-100"
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        {isModeDemo() ? "Overview of your business performance (Demo Mode)." : "Real-time overview of your business performance."}
                    </p>
                </div>
                {isModeDemo() && (
                    <Badge variant="secondary" className="w-fit text-blue-700 bg-blue-50 border-blue-200" data-tour="mode-banner">
                        Sandboxed Environment
                    </Badge>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-tour="dashboard-stats">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.color}`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                {stat.trendUp ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                                )}
                                <span className={stat.trendUp ? "text-green-500" : "text-red-500"}>
                                    {stat.trend}
                                </span>
                                <span className="ml-1">from last month</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Transactions */}
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Transactions</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/merchant/transactions')}>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            No transactions yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.slice(0, 5).map((txn) => (
                                        <TableRow key={txn.id}>
                                            <TableCell className="font-mono text-xs">
                                                {txn.id}
                                                {txn.isDemo && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1 rounded">DEMO</span>}
                                            </TableCell>
                                            <TableCell>{txn.customer}</TableCell>
                                            <TableCell className="font-medium">${txn.amount}</TableCell>
                                            <TableCell>
                                                <Badge variant={txn.status === 'Completed' ? 'success' : txn.status === 'Pending' ? 'warning' : 'destructive'}>
                                                    {txn.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-3" data-tour="quick-actions">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Manage your store efficiently.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {POS_ENABLED && (
                            <>
                                <Button className="w-full justify-start" onClick={() => navigate('/merchant/pos')}>
                                    <Receipt className="mr-2 h-4 w-4" /> Accept Payments (POS)
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/merchant/pos-settings')}>
                                    <Coins className="mr-2 h-4 w-4" /> POS Settings
                                </Button>
                            </>
                        )}
                        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/merchant/payouts')}>
                            <Wallet className="mr-2 h-4 w-4" /> Request Payout
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/merchant/settings')}>
                            <Activity className="mr-2 h-4 w-4" /> Account Settings
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/merchant/reports')}>
                            <TrendingUp className="mr-2 h-4 w-4" /> View Reports
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/merchant/products')}>
                            <CreditCard className="mr-2 h-4 w-4" /> Manage Products
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MerchantDashboardPage;