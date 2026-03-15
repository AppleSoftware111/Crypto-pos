import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminLogs } from '@/lib/adminActionLogger';

const StatCard = ({ title, value, icon: Icon, description, trend, color }) => (
  <Card className="border-l-4 shadow-sm hover:shadow-md transition-all" style={{ borderLeftColor: color }}>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { adminAddress } = useAdmin();
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    setLogs(getAdminLogs().slice(0, 5));
  }, []);

  const stats = [
    { title: "Total Balance", value: "$4,231,890", icon: DollarSign, description: "Across all liquidity pools", color: "#2563eb" },
    { title: "Active Users", value: "12,345", icon: Users, description: "+180 this week", color: "#16a34a" },
    { title: "Pending Deposits", value: "23", icon: ArrowDownLeft, description: "Requires approval", color: "#eab308" },
    { title: "Pending Withdrawals", value: "14", icon: ArrowUpRight, description: "Requires processing", color: "#dc2626" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldCheck className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
              <div className="flex items-center gap-3 mb-2">
                 <img 
                    src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                    alt="Omara Logo" 
                    className="h-10 w-10 brightness-0 invert"
                 />
                 <h1 className="text-3xl font-bold">Welcome back, Super Admin</h1>
              </div>
              <p className="text-slate-300 mb-6 font-mono text-sm opacity-80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {adminAddress}
              </p>
              <div className="flex gap-4">
                <Button variant="secondary" asChild>
                  <Link to="/admin/balance-control">Manage Balance</Link>
                </Button>
                <Button variant="outline" className="bg-transparent text-white border-white/20 hover:bg-white/10" asChild>
                  <Link to="/admin/settings">System Settings</Link>
                </Button>
              </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Admin Activity
            </CardTitle>
            <CardDescription>Latest actions performed by administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.length > 0 ? logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground font-mono">{log.admin.slice(0, 10)}...</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent activity logs found.</p>
              )}
            </div>
            <div className="mt-4 pt-2 border-t text-center">
              <Link to="/admin/settings" className="text-sm text-primary hover:underline">View Full Log History</Link>
            </div>
          </CardContent>
        </Card>

        {/* System Status / Quick Links */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900">
                <span className="text-sm font-medium">Large Withdrawal (10k+)</span>
                <Button size="sm" variant="outline">Review</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900">
                <span className="text-sm font-medium">New Partner Application</span>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/admin/deposits"><ArrowDownLeft className="mr-2 h-4 w-4" /> Deposits</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/admin/withdrawals"><ArrowUpRight className="mr-2 h-4 w-4" /> Withdrawals</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/admin/compliance"><ShieldCheck className="mr-2 h-4 w-4" /> Compliance</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/admin/settings"><Users className="mr-2 h-4 w-4" /> Manage Admins</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;