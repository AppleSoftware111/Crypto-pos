import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const MasterFranchiseProfilePage = () => {
    const { currentUser } = useAuth();
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Profile Management</h1>
                <p className="text-muted-foreground">Manage your account details and branding.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your personal and contact details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={currentUser?.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={currentUser?.email} disabled />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Mobile Number</Label>
                            <Input id="phone" defaultValue={currentUser?.businessPhone} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Residential Address</Label>
                            <Input id="address" defaultValue={currentUser?.businessAddress} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="affiliate">Affiliate Link</Label>
                            <Input id="affiliate" defaultValue={`https://omara.pay/join?ref=${currentUser?.id}`} readOnly />
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseProfilePage;