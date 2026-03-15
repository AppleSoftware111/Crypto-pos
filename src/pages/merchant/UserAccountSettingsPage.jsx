import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

const UserAccountSettingsPage = () => {
    const { currentUser, refreshCurrentUser } = useAuth();
    const { updateUserDetails } = useUsers();
    const { toast } = useToast();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        businessName: '',
        businessPhone: '',
        businessAddress: '',
        industry: '',
        description: '',
        website: '',
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
                businessName: currentUser.businessName || '',
                businessPhone: currentUser.businessPhone || '',
                businessAddress: currentUser.businessAddress || '',
                industry: currentUser.industry || '',
                description: currentUser.description || '',
                website: currentUser.website || '',
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserDetails(currentUser.id, formData);
        refreshCurrentUser();
        toast({
            title: "✅ Success!",
            description: "Your profile details have been updated.",
        });
    };

    const handleImageUpload = (type) => {
         toast({
            title: "🚧 Feature in Progress",
            description: `Uploading ${type} will be available soon!`,
        });
    };

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold">Profile Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your business and contact information.</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                            <CardDescription>Update your business details here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <Input id="businessName" value={formData.businessName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry / Type of Business</Label>
                                    <Input id="industry" value={formData.industry} onChange={handleInputChange} />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="businessAddress">Business Address</Label>
                                <Input id="businessAddress" value={formData.businessAddress} onChange={handleInputChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" value={formData.description} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessPhone">Contact Phone</Label>
                                    <Input id="businessPhone" value={formData.businessPhone} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Contact Email</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" value={formData.website} onChange={handleInputChange} placeholder="https://example.com" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                     <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Business Images</CardTitle>
                            <CardDescription>Upload your logo and storefront photos.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                             <Button type="button" variant="outline" onClick={() => handleImageUpload('logo')}><Upload className="mr-2 h-4 w-4" /> Upload Logo</Button>
                             <Button type="button" variant="outline" onClick={() => handleImageUpload('storefront photo')}><Upload className="mr-2 h-4 w-4" /> Upload Storefront</Button>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 mt-6">
                             <Button type="submit">Save All Changes</Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </form>
        </div>
    );
};

export default UserAccountSettingsPage;