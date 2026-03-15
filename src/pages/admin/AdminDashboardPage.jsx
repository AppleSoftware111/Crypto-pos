import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, TrendingUp, CheckCircle, Clock, AlertTriangle, UserPlus, Bell, GitBranch, ShieldCheck, PieChart, DollarSign } from 'lucide-react';
import { useUsers } from '@/context/UserContext';
import { useMerchant } from '@/context/MerchantContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

const KpiCard = ({ title, value, icon, trend, description }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </CardContent>
        </Card>
    </motion.div>
);

const AdminDashboardPage = () => {
    const { users } = useUsers();
    const { transactions } = useMerchant();

    const totalSalesVolume = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const successfulTransactions = transactions.filter(t => t.status === 'Completed').length;
    const transactionSuccessRate = transactions.length > 0 ? (successfulTransactions / transactions.length * 100).toFixed(1) : 100;
    const pendingApplications = users.filter(u => u.status === 'Pending').length;
    
    // Mock sales data for the chart
    const salesData = [
        { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 }, { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 }, { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
    ];

    const recentActivities = [
        ...users.slice(-2).map(u => ({ type: 'New User', text: `${u.name} just registered.`, time: 'Just now', icon: <UserPlus className="h-4 w-4 text-blue-500" />})),
        ...transactions.slice(-2).map(t => ({ type: 'Transaction', text: `Transaction of $${t.amount.toFixed(2)} processed.`, time: '1 min ago', icon: <DollarSign className="h-4 w-4 text-green-500" />})),
    ];
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Real-time overview of the OMARA ecosystem.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Total Sales Volume" value={`$${totalSalesVolume.toLocaleString()}`} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} trend="+20.1% from last month" />
                <KpiCard title="Transaction Success Rate" value={`${transactionSuccessRate}%`} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} trend="+1.2% this week" />
                <KpiCard title="Total Users" value={users.length} icon={<Users className="h-4 w-4 text-muted-foreground" />} description={`${pendingApplications} pending approval`} />
                <KpiCard title="Affiliate Performance" value="1,245" icon={<GitBranch className="h-4 w-4 text-muted-foreground" />} description="Total Referrals" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sales Trends</CardTitle>
                        <CardDescription>Sales volume over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest system events and actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">{activity.icon}</div>
                                    <div>
                                        <p className="text-sm font-medium">{activity.text}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button asChild><Link to="/admin/users"><UserPlus className="mr-2 h-4 w-4" /> Add New User</Link></Button>
                    <Button asChild variant="secondary"><Link to="/admin/applications"><Bell className="mr-2 h-4 w-4" /> View System Alerts</Link></Button>
                    <Button asChild variant="outline"><Link to="#"><ShieldCheck className="mr-2 h-4 w-4" /> Deploy Update</Link></Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{name: 'Crypto', value: 400}, {name: 'Card', value: 300}, {name: 'Wallet', value: 300}]}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Geographic Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-64 bg-gray-200 dark:bg-gray-700 rounded-md">
                        <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboardPage;