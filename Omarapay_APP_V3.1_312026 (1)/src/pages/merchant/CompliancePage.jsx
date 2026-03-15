import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CompliancePage = () => {
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
                <h1 className="text-3xl font-bold">Compliance</h1>
                <p className="text-muted-foreground">Access compliance information and tools for your business.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>KYC/KYB Documents</CardTitle>
                    <CardDescription>Upload your business's Know Your Customer/Business documents.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Your documents have been submitted and are currently under review.</p>
                    <Button variant="outline" onClick={() => handleAction('Uploading documents')}><Upload className="mr-2 h-4 w-4" /> Upload New Documents</Button>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Merchant Agreement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => handleAction('Downloading agreement')}><Download className="mr-2 h-4 w-4" /> Download</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>AML Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => handleAction('Viewing AML info')}><FileText className="mr-2 h-4 w-4" /> View Guidelines</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Compliance FAQ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => handleAction('Viewing FAQ')}><HelpCircle className="mr-2 h-4 w-4" /> Access FAQ</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CompliancePage;