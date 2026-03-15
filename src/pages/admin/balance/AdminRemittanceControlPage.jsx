import React, { useState } from 'react';
import { useDigitalBalance } from '@/context/DigitalBalanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

const AdminRemittanceControlPage = () => {
    const { remittanceProviders, updateRemittanceProvider } = useDigitalBalance();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Remittance Controls</h1>
            
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Partner Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Exchange Rate (USD-PHP)</TableHead>
                                    <TableHead>Margin %</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {remittanceProviders.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>
                                            <Switch 
                                                checked={p.status === 'active'}
                                                onCheckedChange={(c) => updateRemittanceProvider(p.id, { status: c ? 'active' : 'inactive' })} 
                                            />
                                        </TableCell>
                                        <TableCell>{p.rates['USD-PHP'].toFixed(2)}</TableCell>
                                        <TableCell>{p.margin}%</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminRemittanceControlPage;