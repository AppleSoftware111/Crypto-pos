import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ShieldCheck, DatabaseZap, Globe2 as GlobeLock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminSecurityPrivacyPage = () => {
    const { toast } = useToast();

    const settings = [
        { id: 'ssl', label: 'Enforce SSL', description: 'Redirect all HTTP traffic to HTTPS.' },
        { id: 'brute-force', label: 'Brute-force Protection', description: 'Lock accounts after multiple failed login attempts.' },
        { id: 'captcha', label: 'CAPTCHA on Login', description: 'Protect against automated login bots.' },
    ];
    
    const handleAction = () => {
        toast({
            title: "🚧 Feature in Progress",
            description: "This functionality is coming soon!",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Security & Privacy Settings</h1>
                <p className="text-muted-foreground">Customize platform-wide security and privacy protocols.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Security Protocols</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {settings.map(setting => (
                        <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <Label htmlFor={setting.id} className="font-medium">{setting.label}</Label>
                                <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                            <Switch id={setting.id} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Data Security & Encryption</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Review the status of data encryption methods.</p>
                        <Button onClick={handleAction} variant="secondary">
                            <DatabaseZap className="mr-2 h-4 w-4" /> View Encryption Status
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>IP Tracking & Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Monitor and manage IP addresses accessing the platform.</p>
                        <Button onClick={handleAction} variant="secondary">
                            <GlobeLock className="mr-2 h-4 w-4" /> Manage IP Lists
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSecurityPrivacyPage;