import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, ShieldCheck, Store, FileText, UploadCloud, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const BusinessRegistrationSuccess = ({ business, documentsSubmitted }) => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(5);
    
    // Auto redirect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/merchant/dashboard');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto py-8"
        >
            <Card className="border-t-4 border-t-green-500 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                    {/* Header Section */}
                    <div className="bg-green-50 dark:bg-green-950/30 p-8 text-center border-b border-green-100 dark:border-green-900">
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"
                        >
                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            {documentsSubmitted 
                                ? "Your account has been created and documents submitted for review."
                                : "Your business account has been created successfully."
                            }
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 space-y-8">
                        
                        {/* Status Card */}
                        <div className="bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm flex items-start gap-4">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-yellow-700 dark:text-yellow-500" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Current Status:</h3>
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                        {documentsSubmitted ? "AWAITING REVIEW" : "PENDING KYC"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {documentsSubmitted 
                                        ? "Our compliance team will review your documents within 3-7 business days." 
                                        : "You can upload verification documents anytime from your Merchant Dashboard to unlock full features."
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Business Details Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                                <div className="flex items-center gap-2 mb-1 text-muted-foreground text-sm">
                                    <Store className="w-4 h-4" /> Business Name
                                </div>
                                <p className="font-semibold text-lg">{business.business_name}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                                <div className="flex items-center gap-2 mb-1 text-muted-foreground text-sm">
                                    <FileText className="w-4 h-4" /> Account Type
                                </div>
                                <p className="font-semibold text-lg">{business.business_type}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-4">
                            <Button 
                                size="lg" 
                                className="w-full gap-2 text-md" 
                                onClick={() => navigate('/merchant/dashboard')}
                            >
                                Go to Merchant Dashboard <ArrowRight className="w-4 h-4" />
                            </Button>
                            
                            {!documentsSubmitted && (
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="w-full gap-2"
                                    onClick={() => navigate('/merchant/documents')}
                                >
                                    <UploadCloud className="w-4 h-4" /> Upload Documents Later
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Redirecting to dashboard in {timeLeft}s...</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default BusinessRegistrationSuccess;