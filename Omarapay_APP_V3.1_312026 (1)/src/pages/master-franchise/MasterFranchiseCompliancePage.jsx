import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'lucide-react';

const MasterFranchiseCompliancePage = () => {
    const { toast } = useToast();

    const handleUpload = (e) => {
        e.preventDefault();
        toast({
            title: "Documents Uploaded",
            description: "Your KYC/KYB documents have been submitted for review.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Compliance</h1>
                <p className="text-muted-foreground">Manage your compliance documents and access resources.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>KYC/KYB Document Upload</CardTitle>
                    <CardDescription>Submit your own operational documents to OMARA.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpload} className="space-y-4 max-w-lg">
                        <div className="space-y-2"><Label htmlFor="kyc-doc">Business Registration</Label><Input id="kyc-doc" type="file" /></div>
                        <div className="space-y-2"><Label htmlFor="kyb-doc">Owner's Government ID</Label><Input id="kyb-doc" type="file" /></div>
                        <Button type="submit">Upload Documents</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Button variant="outline">Download Merchant Agreement</Button>
                    <Button variant="outline">View AML Information</Button>
                    <Button variant="outline">Compliance FAQ</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseCompliancePage;