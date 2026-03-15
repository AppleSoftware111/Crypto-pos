import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const AdminAccessControlPage = () => {
    const { toast } = useToast();
    
    const handleSave = () => {
        toast({
            title: "✅ Settings Saved",
            description: "Access control policies have been updated.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Access Control</h1>
                <p className="text-muted-foreground">Manage global access policies and security settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Login Policies</CardTitle>
                    <CardDescription>Configure rules for user login attempts and sessions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="login-attempts" className="flex flex-col space-y-1">
                          <span>Login Attempt Limit</span>
                          <span className="font-normal leading-snug text-muted-foreground">
                            Number of attempts before locking an account.
                          </span>
                        </Label>
                        <Input id="login-attempts" type="number" defaultValue="5" className="w-24" />
                    </div>
                     <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="session-timeout" className="flex flex-col space-y-1">
                          <span>Session Timeout (minutes)</span>
                          <span className="font-normal leading-snug text-muted-foreground">
                            Automatically log out users after inactivity.
                          </span>
                        </Label>
                        <Input id="session-timeout" type="number" defaultValue="30" className="w-24" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave}>Save Login Policies</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Geographic Restrictions</CardTitle>
                    <CardDescription>Limit access based on user location. (Coming Soon)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="ip-whitelist" className="flex flex-col space-y-1">
                          <span>IP Whitelist</span>
                          <span className="font-normal leading-snug text-muted-foreground">
                            Only allow logins from these specific IP addresses.
                          </span>
                        </Label>
                        <Input id="ip-whitelist" placeholder="e.g., 192.168.1.1, 203.0.113.0/24" disabled />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button disabled>Save Geographic Settings</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AdminAccessControlPage;