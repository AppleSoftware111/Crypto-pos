import React, { useState, useEffect } from 'react';
import { useBusiness } from '@/context/BusinessContext';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2, Check, Save, Home, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Steps
import OwnerInfoStep from './steps/OwnerInfoStep';
import BusinessInfoStep from './steps/BusinessInfoStep';
import BusinessRegistrationStep from './steps/BusinessRegistrationStep';
import BusinessPresenceStep from './steps/BusinessPresenceStep';
import WalletSigningStep from './steps/WalletSigningStep'; // New Step
import SuccessStep from './steps/SuccessStep';

const STORAGE_KEY_DRAFT = 'omara_registration_draft';

// Steps Configuration
const steps = [
    { id: 1, title: 'Owner Info', component: OwnerInfoStep },
    { id: 2, title: 'Business Info', component: BusinessInfoStep },
    { id: 3, title: 'Registration', component: BusinessRegistrationStep },
    { id: 4, title: 'Presence', component: BusinessPresenceStep },
    { id: 5, title: 'Wallet Signing', component: WalletSigningStep }, // Added Step 5
    { id: 6, title: 'Complete', component: SuccessStep }
];

const BusinessRegistrationForm = () => {
    const { registerBusiness } = useBusiness();
    const { isConnected, address } = useAccount();
    const { toast } = useToast();
    const navigate = useNavigate();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Signing State
    const [signature, setSignature] = useState(null);
    
    // Dialog States
    const [showDraftDialog, setShowDraftDialog] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    
    const [formData, setFormData] = useState({
        ownerFirstName: '',
        ownerLastName: '',
        ownerMobileNumber: '',
        ownerResidentialAddress: '',
        businessName: '',
        businessType: '',
        businessCountry: 'Philippines',
        hasBusinessRegistration: 'no',
        businessRegistrationNumber: '',
        businessOperationType: '',
        businessWebsiteUrl: '',
        businessFacebookPage: ''
    });

    // --- Draft Logic ---
    useEffect(() => {
        const checkDraft = () => {
            const savedDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
            if (savedDraft) {
                setShowDraftDialog(true);
            }
        };
        checkDraft();
    }, []);

    const saveDraft = () => {
        const draft = {
            data: formData,
            step: currentStep,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draft));
        toast({ title: "Draft Saved", description: "Progress saved securely." });
    };

    const loadDraft = () => {
        try {
            const savedDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
            if (savedDraft) {
                const parsed = JSON.parse(savedDraft);
                setFormData(parsed.data);
                // Don't resume at step 6 (success) or 5 (signing) to ensure fresh sign
                const resumeStep = parsed.step >= 5 ? 4 : parsed.step;
                setCurrentStep(resumeStep || 1);
                toast({ title: "Draft Loaded" });
            }
        } catch (e) {
            clearDraft();
        }
        setShowDraftDialog(false);
    };

    const clearDraft = () => {
        localStorage.removeItem(STORAGE_KEY_DRAFT);
        setShowDraftDialog(false);
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.ownerFirstName) newErrors.ownerFirstName = "Required";
            if (!formData.ownerLastName) newErrors.ownerLastName = "Required";
            if (!formData.ownerMobileNumber) newErrors.ownerMobileNumber = "Required";
            if (!formData.ownerResidentialAddress) newErrors.ownerResidentialAddress = "Required";
        }
        if (step === 2) {
            if (!formData.businessName) newErrors.businessName = "Required";
            if (!formData.businessType) newErrors.businessType = "Required";
        }
        if (step === 4) {
            if (!formData.businessOperationType) newErrors.businessOperationType = "Select operation type";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
            toast({ variant: "destructive", title: "Validation Error", description: "Please check fields." });
        }
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleExit = () => {
        setShowExitDialog(false);
        navigate(-1);
    };

    // Callback for WalletSigningStep
    const handleSignComplete = async (sig, walletAddr) => {
        setSignature(sig);
        
        // Auto submit after signing
        await handleSubmit(sig);
    };

    const handleSubmit = async (sigToUse) => {
        const finalSig = sigToUse || signature;
        
        if (!finalSig) {
            toast({ variant: "destructive", title: "Signature Required", description: "Please sign to continue." });
            return;
        }

        setLoading(true);
        try {
            await registerBusiness(formData, finalSig);
            setCurrentStep(6); // Success Step
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    const CurrentStepComponent = steps[currentStep - 1].component;

    if (!isConnected) {
        return (
             <div className="max-w-md mx-auto py-12 px-4 text-center">
                <Card className="border-2 border-dashed">
                    <CardHeader>
                        <Wallet className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                        <h2 className="text-xl font-bold">Connect Wallet</h2>
                        <p className="text-muted-foreground">Wallet connection required for registration.</p>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button onClick={() => navigate('/login')}>Connect Now</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (currentStep === 6) {
        return <SuccessStep data={formData} clearDraft={clearDraft} walletAddress={address} signature={signature} />;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                 <Button variant="ghost" size="sm" onClick={() => setShowExitDialog(true)}>
                    <Home className="w-4 h-4 mr-2" /> Home
                 </Button>
                 <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                     {address?.substring(0,6)}...{address?.substring(address.length-4)}
                 </div>
            </div>

            <div className="mb-8">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                    <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between px-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                     <span>Start</span>
                     <span>Details</span>
                     <span>Sign</span>
                     <span>Finish</span>
                </div>
            </div>

            <Card className="shadow-xl">
                <CardHeader>
                    <h2 className="text-2xl font-bold">{steps[currentStep-1].title}</h2>
                </CardHeader>
                <CardContent>
                    <CurrentStepComponent 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        errors={errors}
                        onSignComplete={handleSignComplete} // Passed to signing step
                    />
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    {currentStep > 1 && currentStep < 5 && (
                        <Button variant="outline" onClick={handleBack} disabled={loading}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    )}
                    {currentStep < 4 && (
                        <Button onClick={handleNext} className="ml-auto">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    )}
                    {currentStep === 4 && (
                         <Button onClick={handleNext} className="ml-auto">Proceed to Signing <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    )}
                    {/* Step 5 (Signing) has its own button inside the component */}
                </CardFooter>
            </Card>

            <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Resume?</DialogTitle></DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={clearDraft}>Start Over</Button>
                        <Button onClick={loadDraft}>Resume</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Leave?</DialogTitle></DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowExitDialog(false)}>Stay</Button>
                        <Button variant="destructive" onClick={handleExit}>Leave</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BusinessRegistrationForm;