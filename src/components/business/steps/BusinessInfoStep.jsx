import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BusinessInfoStep = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
        <Input 
          id="businessName" 
          value={formData.businessName || ''} 
          onChange={(e) => updateFormData('businessName', e.target.value)}
          placeholder="My Amazing Shop"
          className={errors?.businessName ? 'border-red-500' : ''}
        />
        {errors?.businessName && <p className="text-xs text-red-500">{errors.businessName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">Business Type <span className="text-red-500">*</span></Label>
        <Select 
            value={formData.businessType || ''} 
            onValueChange={(val) => updateFormData('businessType', val)}
        >
            <SelectTrigger className={errors?.businessType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Sole Proprietor">Sole Proprietor</SelectItem>
                <SelectItem value="Online Seller">Online Seller</SelectItem>
                <SelectItem value="Freelancer">Freelancer</SelectItem>
                <SelectItem value="Corporation">Corporation</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
        </Select>
        {errors?.businessType && <p className="text-xs text-red-500">{errors.businessType}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessCountry">Country of Business Operation <span className="text-red-500">*</span></Label>
        <Select 
            value={formData.businessCountry || 'Philippines'} 
            onValueChange={(val) => updateFormData('businessCountry', val)}
        >
            <SelectTrigger className={errors?.businessCountry ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Philippines">Philippines</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="Malaysia">Malaysia</SelectItem>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
                <SelectItem value="Thailand">Thailand</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
            </SelectContent>
        </Select>
        {errors?.businessCountry && <p className="text-xs text-red-500">{errors.businessCountry}</p>}
      </div>
    </div>
  );
};

export default BusinessInfoStep;