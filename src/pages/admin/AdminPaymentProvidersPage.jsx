import React from 'react';
import { usePaymentProviders } from '@/context/PaymentProviderContext';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Save, Settings } from 'lucide-react';

const AdminPaymentProvidersPage = () => {
    const { providers, updateProvider, toggleProvider } = usePaymentProviders();

    return (
        <StandardPageWrapper title="Payment Providers" subtitle="Configure fees, limits and availability of payment methods.">
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" /> Provider Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Provider</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Fee (%)</TableHead>
                                <TableHead>Fixed Fee</TableHead>
                                <TableHead>Daily Limit</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {providers.map((provider) => (
                                <TableRow key={provider.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {provider.logo ? (
                                                <img src={provider.logo} alt={provider.name} className="w-8 h-8 object-contain rounded bg-white p-0.5" />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {provider.name.charAt(0)}
                                                </div>
                                            )}
                                            {provider.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{provider.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch 
                                                checked={provider.enabled} 
                                                onCheckedChange={() => toggleProvider(provider.id)} 
                                            />
                                            <span className={`text-xs font-medium ${provider.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                                                {provider.enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative w-20">
                                            <Input 
                                                type="number" 
                                                defaultValue={provider.feePercentage}
                                                className="h-8 pr-6"
                                                onBlur={(e) => updateProvider(provider.id, { feePercentage: parseFloat(e.target.value) })}
                                            />
                                            <span className="absolute right-2 top-1.5 text-xs text-muted-foreground">%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative w-24">
                                            <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">$</span>
                                            <Input 
                                                type="number" 
                                                defaultValue={provider.feeFixed}
                                                className="h-8 pl-5"
                                                onBlur={(e) => updateProvider(provider.id, { feeFixed: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative w-32">
                                            <Input 
                                                type="number" 
                                                defaultValue={provider.dailyLimit}
                                                className="h-8"
                                                onBlur={(e) => updateProvider(provider.id, { dailyLimit: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost">Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </StandardPageWrapper>
    );
};

export default AdminPaymentProvidersPage;