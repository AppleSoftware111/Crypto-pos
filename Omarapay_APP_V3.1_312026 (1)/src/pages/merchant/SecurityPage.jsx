import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { KeyRound, Shield, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SecurityPage = () => {
    const { toast } = useToast();

    const handleAction = (feature) => {
        toast({
            title: "🚧 Feature in Progress",
            description: `${feature} will be available soon!`,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Security & Privacy</h1>
                <p className="text-muted-foreground">Manage your account's security settings.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                        </div>
                        <Button className="w-full" onClick={() => handleAction('Changing password')}><KeyRound className="mr-2 h-4 w-4" /> Update Password</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                        <CardDescription>Add an extra layer of security to your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <Label htmlFor="2fa-switch" className="flex items-center">
                                <Shield className="mr-2 h-5 w-5 text-primary" />
                                Enable 2FA
                            </Label>
                            <Switch id="2fa-switch" onCheckedChange={() => handleAction('Toggling 2FA')} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>View recent logins and critical actions on your account.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                    <History className="mx-auto h-12 w-12 mb-4" />
                    <p>Activity log coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SecurityPage;