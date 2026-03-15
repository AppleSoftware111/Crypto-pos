import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Copy, Share2 } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';

const LinkManagementPage = () => {
    const { toast } = useToast();
    const affiliateLink = "https://omara.pay/join?ref=MERCHANT123";
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(affiliateLink);
        toast({
            title: "✅ Copied!",
            description: "Affiliate link copied to clipboard.",
        });
    };

    const handleShare = () => {
        toast({
            title: "🚧 Feature in Progress",
            description: "Social media sharing will be available soon!",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Link Management</h1>
                <p className="text-muted-foreground">Generate QR codes and share your affiliate link.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Unique QR Code</CardTitle>
                        <CardDescription>Customers can scan this to visit your page or use your referral.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center p-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <QRCode value={affiliateLink} size={192} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Affiliate Link</CardTitle>
                        <CardDescription>Share this link to refer new customers and earn rewards.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input value={affiliateLink} readOnly />
                            <Button variant="outline" size="icon" onClick={copyToClipboard}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button className="w-full" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LinkManagementPage;