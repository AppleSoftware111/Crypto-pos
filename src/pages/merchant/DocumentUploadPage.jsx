import React from 'react';
import { useBusiness } from '@/context/BusinessContext';
import { useNavigate } from 'react-router-dom';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import DocumentUploadComponent from '@/components/business/DocumentUploadComponent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DocumentUploadPage = () => {
    const { businessProfile, uploadDocuments } = useBusiness();
    const navigate = useNavigate();

    const handleComplete = async (files) => {
        try {
            await uploadDocuments(businessProfile.id, files);
            // After successful upload context update, maybe redirect
            navigate('/merchant/dashboard');
        } catch (e) {
            console.error("Upload process failed", e);
        }
    };

    if (!businessProfile) return <div>Loading...</div>;

    return (
        <StandardPageWrapper 
            title="Business Verification" 
            subtitle="Securely upload your KYC/KYB documents."
        >
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/merchant/dashboard')} className="pl-0 hover:pl-2 transition-all">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-4">Current Status</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        businessProfile.status === 'PENDING_KYC' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Profile Created</p>
                                        <p className="text-xs text-muted-foreground">Basic info submitted</p>
                                    </div>
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </div>

                                <div className="w-0.5 h-8 bg-gray-200 ml-4"></div>

                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                        businessProfile.status === 'PENDING_KYC' ? 'border-blue-500 bg-white text-blue-500' : 
                                        'bg-green-100 text-green-600 border-transparent'
                                    }`}>
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Document Upload</p>
                                        <p className="text-xs text-muted-foreground">Pending your action</p>
                                    </div>
                                </div>

                                <div className="w-0.5 h-8 bg-gray-200 ml-4"></div>

                                <div className="flex items-center gap-3 opacity-50">
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Admin Review</p>
                                        <p className="text-xs text-muted-foreground">3-7 business days</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {businessProfile.admin_notes && (
                        <Card className="bg-yellow-50 border-yellow-200">
                            <CardContent className="pt-6 text-sm text-yellow-800">
                                <strong>Admin Note:</strong><br/>
                                {businessProfile.admin_notes}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Upload Area */}
                <div className="lg:col-span-2">
                    <DocumentUploadComponent 
                        businessId={businessProfile.id} 
                        onComplete={handleComplete} 
                    />
                </div>
            </div>
        </StandardPageWrapper>
    );
};

export default DocumentUploadPage;