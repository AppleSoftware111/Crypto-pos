import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useDigitalBalance } from '@/context/DigitalBalanceContext';

const AdminAnalyticsReportingPage = () => {
  const { transactions } = useDigitalBalance();

  const data = [
      { name: 'Mon', volume: 4000 },
      { name: 'Tue', volume: 3000 },
      { name: 'Wed', volume: 2000 },
      { name: 'Thu', volume: 2780 },
      { name: 'Fri', volume: 1890 },
      { name: 'Sat', volume: 2390 },
      { name: 'Sun', volume: 3490 },
  ];

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics & Reporting</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Transactions</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{transactions.length}</div></CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Volume (7d)</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">$45,231.89</div></CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Users</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">1,203</div></CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Fee Revenue</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">$1,230.50</div></CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Transaction Volume (Weekly)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
};

export default AdminAnalyticsReportingPage;