import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const MasterFranchiseSecurityPage = () => {
    const { toast } = useToast();

    const handleChangePassword = (e) => {
        e.preventDefault();
        toast({
            title: "Password Changed",
            description: "Your password has been updated successfully.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Security & Privacy</h1>
                <p className="text-muted-foreground">Manage your account security settings.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
                        <div className="space-y-2"><Label htmlFor="current-pass">Current Password</Label><Input id="current-pass" type="password" /></div>
                        <div className="space-y-2"><Label htmlFor="new-pass">New Password</Label><Input id="new-pass" type="password" /></div>
                        <Button type="submit">Change Password</Button>
                    </form>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-2">
                    <Switch id="2fa-switch" />
                    <Label htmlFor="2fa-switch">Enable 2FA</Label>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>API Key Management</CardTitle>
                    <CardDescription>For your own custom integrations.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-2">
                        <Label>Your API Key</Label>
                        <Input readOnly value="mf_sk_live_******************" />
                        <Button variant="secondary">Rotate Key</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseSecurityPage;