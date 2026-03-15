import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useBusiness } from '@/context/BusinessContext';
import { useMerchant } from '@/context/MerchantContext';
import { AlertTriangle, FlaskConical } from 'lucide-react';

const SettingsPage = () => {
    const { businessProfile } = useBusiness();
    const { isModeLive, isModeDemo, switchToLiveMode, switchToDemoMode } = useMerchant();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">Manage your merchant account preferences.</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${isModeLive() ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    Current Mode: {isModeLive() ? 'LIVE' : 'DEMO'}
                </div>
            </div>

            <Tabs defaultValue="general">
                <TabsList className="mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="mode">Environment</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                            <CardDescription>Update your public business details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Business Name</Label>
                                    <Input defaultValue={businessProfile?.businessName} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website</Label>
                                    <Input defaultValue={businessProfile?.businessWebsiteUrl || ''} placeholder="https://..." />
                                </div>
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Choose what you want to be notified about.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Email Alerts for New Orders</Label>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>SMS Alerts for Payouts</Label>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label>Merchant ID</Label>
                                <code className="block p-2 bg-muted rounded text-sm">{businessProfile?.merchantId}</code>
                            </div>
                             <div className="space-y-1">
                                <Label>Bound Wallet Address</Label>
                                <code className="block p-2 bg-muted rounded text-sm">{businessProfile?.walletAddress}</code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="mode" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Environment Settings</CardTitle>
                            <CardDescription>Manage your Demo and Live environments.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isModeDemo() ? (
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <FlaskConical className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-blue-900">You are currently in Demo Mode</h4>
                                            <p className="text-sm text-blue-700 mt-1">
                                                This environment allows you to test transactions, payouts, and API integrations without using real money.
                                            </p>
                                            <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={switchToLiveMode}>
                                                Switch to Live Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-red-900">Live Mode is Active</h4>
                                            <p className="text-sm text-red-700 mt-1">
                                                Warning: All actions taken here are real. Money will be moved and transactions cannot be undone.
                                            </p>
                                            <Button variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-100" onClick={switchToDemoMode}>
                                                Switch back to Demo Mode
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsPage;