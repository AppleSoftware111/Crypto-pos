import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BUSINESS_TYPES } from '@/lib/businessSchema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, Phone, Mail, Save } from 'lucide-react';
import CountrySelect from '@/components/common/CountrySelect';
import DatePicker from '@/components/common/DatePicker';
import GoogleMapLocationPicker from '@/components/common/GoogleMapLocationPicker';
import { useToast } from '@/components/ui/use-toast';
import { normalizeLocation } from '@/lib/locationNormalizer';

const BusinessProfileForm = ({ onComplete, initialData }) => {
    const { register, handleSubmit, control, formState: { errors }, setValue, watch, getValues } = useForm({
        mode: 'onChange',
        defaultValues: initialData || {}
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    // Watch for location changes to auto-update country if needed
    const locationData = watch('location');

    useEffect(() => {
        if (locationData && locationData.country) {
            const currentCountry = watch('country');
            if (currentCountry !== locationData.country) {
                 setValue('country', locationData.country, { shouldValidate: true, shouldDirty: true });
                 toast({
                     title: "Country Updated",
                     description: `Region set to ${locationData.country} based on your map selection.`
                 });
            }
        }
    }, [locationData?.country, setValue, watch, toast]);

    // Handle Manual Draft Save
    const handleSaveDraft = () => {
        const formData = getValues();
        localStorage.setItem('business_registration_draft_step1', JSON.stringify(formData));
        toast({
            title: "Draft Saved",
            description: "Your business profile draft was saved on this device.",
        });
    };

    const onSubmit = async (data) => {
        // Double check validation for location
        if (!data.location) {
            toast({
                variant: "destructive",
                title: "Location Required",
                description: "Please select your business location on the map."
            });
            return;
        }

        // Normalize Location using the utility
        const normalizedLocation = normalizeLocation(data.location);

        if (!normalizedLocation) {
            toast({
                variant: "destructive",
                title: "Invalid Location",
                description: "The location data is incomplete. Please select a valid address on the map."
            });
            return;
        }

        setIsSubmitting(true);
        // Simulate API call processing time
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Structure data for parent - NESTED Address Object
        const formattedData = {
            ...data,
            // We do NOT spread location fields into root. 
            // We pass the normalized address object as 'address' field.
            address: normalizedLocation,
            // Remove raw 'location' field from final payload to avoid duplication/confusion
            location: undefined 
        };
        
        console.log('BusinessProfileForm - Final Submission Payload:', formattedData);

        onComplete(formattedData);
        setIsSubmitting(false);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-lg border-t-4 border-t-primary">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" /> 
                    Basic Business Profile
                </CardTitle>
                <CardDescription>
                    Step 1: Provide your business details and location.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Basic Details */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Business Name <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="name" 
                                    placeholder="e.g. Acme Corp" 
                                    {...register("name", { required: "Business Name is required" })} 
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="type">Business Type <span className="text-red-500">*</span></Label>
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{ required: "Business Type is required" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BUSINESS_TYPES.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Contact Email <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                                        placeholder="contact@business.com" 
                                        {...register("email", { 
                                            required: "Email is required",
                                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                        })} 
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="phone">Mobile Number <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="phone" 
                                        className={`pl-9 ${errors.phone ? "border-red-500" : ""}`}
                                        placeholder="+1 234 567 890" 
                                        {...register("phone", { required: "Phone is required" })} 
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                                <Controller
                                    name="country"
                                    control={control}
                                    rules={{ required: "Country is required" }}
                                    render={({ field }) => (
                                        <CountrySelect 
                                            value={field.value} 
                                            onChange={field.onChange} 
                                            error={errors.country?.message}
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="registrationDate">Registration Date <span className="text-red-500">*</span></Label>
                                <Controller
                                    name="registrationDate"
                                    control={control}
                                    rules={{ required: "Date is required" }}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={errors.registrationDate?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Location Picker */}
                        <div className="space-y-2 pt-4 border-t">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <Label className="text-base font-semibold">Business Location <span className="text-red-500">*</span></Label>
                                    <p className="text-sm text-muted-foreground">
                                        Pin your precise location on the map.
                                    </p>
                                </div>
                            </div>
                            
                            <Controller
                                name="location"
                                control={control}
                                rules={{ 
                                    required: "Location is required",
                                    validate: (val) => (val && (val.latitude || val.lat)) || "Please drop a pin on the map"
                                }}
                                render={({ field }) => (
                                    <GoogleMapLocationPicker 
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.location?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            disabled={isSubmitting}
                            onClick={handleSaveDraft}
                        >
                           <Save className="w-4 h-4 mr-2" /> Save Draft
                        </Button>
                        <Button type="submit" className="min-w-[200px]" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Processing..." : "Submit for KYC Verification"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default BusinessProfileForm;