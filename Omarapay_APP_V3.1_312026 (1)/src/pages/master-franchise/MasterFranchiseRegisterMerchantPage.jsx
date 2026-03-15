import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const Section = ({ title, description, children }) => (
    <div className="py-4 border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const MasterFranchiseRegisterMerchantPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "Merchant Application Submitted",
            description: "The new merchant's application is now pending review.",
        });
        e.target.reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Register New Merchant</h1>
                <p className="text-muted-foreground">Onboard a new business to the OMARA network.</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Section title="Business Information" description="Details about the merchant's business.">
                            <div className="space-y-2"><Label>Business Name</Label><Input required /></div>
                            <div className="space-y-2"><Label>Business Address</Label><Input required /></div>
                            <div className="space-y-2"><Label>Contact Email</Label><Input type="email" required /></div>
                            <div className="space-y-2"><Label>Industry</Label><Input /></div>
                            <div className="md:col-span-2 space-y-2"><Label>Description</Label><Textarea /></div>
                        </Section>

                        <Section title="Legal & Financial" description="Upload required documents and financial details.">
                            <div className="space-y-2"><Label>Business Registration Doc</Label><Input type="file" /></div>
                            <div className="space-y-2"><Label>Owner's ID</Label><Input type="file" /></div>
                            <div className="space-y-2"><Label>Bank Account Number</Label><Input /></div>
                            <div className="space-y-2"><Label>Financial Statements</Label><Input type="file" /></div>
                        </Section>
                        
                        <div className="pt-4">
                            <Button type="submit" size="lg">Submit for Approval</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseRegisterMerchantPage;