import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, HardDrive, KeyRound, MapPin, UserCheck, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AccountSetupPage = () => {
    const { currentUser } = useAuth();

    const setupSteps = [
        {
            title: 'Connect Account to Web Dashboard',
            description: 'Your account is connected and active.',
            isComplete: true,
            icon: <UserCheck className="h-6 w-6 text-green-600 mr-4" />,
            link: null,
        },
        {
            title: 'Complete KYC/KYB Verification',
            description: 'Submit your business documents for approval.',
            isComplete: currentUser?.status === 'Approved',
            icon: <ShieldCheck className="h-6 w-6 text-primary mr-4" />,
            link: '/dashboard/compliance',
            buttonText: 'Go to Compliance'
        },
        {
            title: 'Register POS Hardware',
            description: 'Add your physical POS terminals.',
            isComplete: false, 
            icon: <HardDrive className="h-6 w-6 text-primary mr-4" />,
            link: '/dashboard/pos-management',
            buttonText: 'Go to POS Mgmt'
        },
        {
            title: 'Add POS Licensing Key',
            description: 'Activate your terminals with a license key.',
            isComplete: false,
            icon: <KeyRound className="h-6 w-6 text-primary mr-4" />,
            link: '/dashboard/pos-management',
            buttonText: 'Go to POS Mgmt'
        },
        {
            title: 'Branch Registration',
            description: 'Register new branches for your business.',
            isComplete: false,
            icon: <MapPin className="h-6 w-6 text-primary mr-4" />,
            link: '/dashboard/pos-management',
            buttonText: 'Go to POS Mgmt'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Account Setup</h1>
                <p className="text-muted-foreground">Manage the initial setup and configuration of your OMARA account.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Setup Checklist</CardTitle>
                    <CardDescription>Complete these steps to get your account fully operational.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {setupSteps.map((step) => (
                        <div key={step.title} className={`flex items-center justify-between p-4 rounded-lg transition-colors ${step.isComplete ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-secondary/50'}`}>
                            <div className="flex items-center">
                                {step.isComplete ? <CheckCircle className="h-6 w-6 text-green-600 mr-4" /> : step.icon}
                                <div>
                                    <p className="font-semibold">{step.title}</p>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                            {step.link ? (
                                <Button asChild variant="secondary" size="sm">
                                    <Link to={step.link}>{step.buttonText}</Link>
                                </Button>
                            ) : (
                                <Button variant="ghost" disabled>Completed</Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountSetupPage;