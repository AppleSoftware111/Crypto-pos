import React from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, CheckCircle, UserPlus, DollarSign, PackagePlus } from 'lucide-react';
import { useUsers } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const KpiCard = ({ title, value, icon, description }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </CardContent>
        </Card>
    </motion.div>
);

const MasterFranchiseDashboardPage = () => {
    const { users } = useUsers();
    const merchants = users.filter(u => u.role === 'Merchant');

    const salesData = [
        { name: 'Jan', sales: 2400 }, { name: 'Feb', sales: 1398 },
        { name: 'Mar', sales: 9800 }, { name: 'Apr', sales: 3908 },
        { name: 'May', sales: 4800 }, { name: 'Jun', sales: 3800 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Master Franchise Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Overview of your network and operations.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Total Merchants" value={merchants.length} icon={<Users className="h-4 w-4 text-muted-foreground" />} description="Merchants onboarded" />
                <KpiCard title="Commissions Earned" value="$12,234.56" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} description="+15% this month" />
                <KpiCard title="Active POS Terminals" value="150" icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} description="Across your network" />
                <KpiCard title="Network Sales" value="$250,430" icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} description="Total volume this quarter" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Network Sales Volume</CardTitle>
                    <CardDescription>Sales trends across your merchant network.</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button asChild><Link to="/master-franchise/merchants/register"><UserPlus className="mr-2 h-4 w-4" /> Register New Merchant</Link></Button>
                    <Button asChild variant="secondary"><Link to="/master-franchise/products/order"><PackagePlus className="mr-2 h-4 w-4" /> Order POS Terminals</Link></Button>
                    <Button asChild variant="outline"><Link to="/master-franchise/merchants">View Merchant Reports</Link></Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseDashboardPage;