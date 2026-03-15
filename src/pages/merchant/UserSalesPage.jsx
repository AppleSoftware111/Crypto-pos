import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, BarChart, HardDrive, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const UserSalesPage = () => {
    const { toast } = useToast();

    const salesByMachineData = [
        { name: 'POS-001', sales: 4000 },
        { name: 'POS-002', sales: 3000 },
        { name: 'POS-003', sales: 2000 },
    ];

    const salesByCashierData = [
        { name: 'Jane Doe', sales: 5000 },
        { name: 'John Smith', sales: 4000 },
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
                    <h1 className="text-3xl font-bold">Sales Monitoring</h1>
                    <p className="text-muted-foreground">Track and analyze your business's sales data in detail.</p>
                </div>
                <Button onClick={() => handleAction('Generating a custom report')}><Download className="mr-2 h-4 w-4" /> Generate Report</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><HardDrive className="mr-2 h-5 w-5" /> Sales by Machine</CardTitle>
                        <CardDescription>Performance per individual POS terminal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsBarChart data={salesByMachineData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="currentColor" className="fill-primary" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5" /> Sales by Cashier</CardTitle>
                        <CardDescription>Performance attributed to specific cashiers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsBarChart data={salesByCashierData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="currentColor" className="fill-secondary" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods Analysis</CardTitle>
                    <CardDescription>Breakdown of sales by payment method.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for payment methods analysis */}
                    <div className="text-center py-12 text-muted-foreground">
                        <BarChart className="mx-auto h-12 w-12 mb-4" />
                        <p>Detailed payment method analysis coming soon.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserSalesPage;