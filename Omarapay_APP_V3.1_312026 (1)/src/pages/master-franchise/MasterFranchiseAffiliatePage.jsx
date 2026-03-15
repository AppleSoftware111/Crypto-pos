import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const MasterFranchiseAffiliatePage = () => {
    const { toast } = useToast();

    const handleRegister = (e) => {
        e.preventDefault();
        toast({
            title: "Affiliate Registered",
            description: "The new affiliate has been successfully onboarded.",
        });
        e.target.reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Affiliate Management</h1>
                <p className="text-muted-foreground">Manage affiliates in your network.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Register New Affiliate</CardTitle>
                    <CardDescription>Onboard a new affiliate to your network.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4 max-w-md">
                        <div className="space-y-2"><Label htmlFor="aff-name">Full Name</Label><Input id="aff-name" required /></div>
                        <div className="space-y-2"><Label htmlFor="aff-email">Email</Label><Input id="aff-email" type="email" required /></div>
                        <Button type="submit">Register Affiliate</Button>
                    </form>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Affiliate Performance</CardTitle>
                    <CardDescription>Performance metrics are coming soon.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Dashboard with affiliate performance will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseAffiliatePage;