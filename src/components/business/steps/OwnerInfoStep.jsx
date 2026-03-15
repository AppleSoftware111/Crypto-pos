import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const OwnerInfoStep = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Owner Information</h3>
        <p className="text-sm text-muted-foreground">Tell us about yourself. This information is required for account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ownerFirstName">First Name <span className="text-red-500">*</span></Label>
          <Input 
            id="ownerFirstName" 
            value={formData.ownerFirstName || ''} 
            onChange={(e) => updateFormData('ownerFirstName', e.target.value)} 
            className={errors.ownerFirstName ? 'border-red-500' : ''}
            placeholder="e.g. Juan"
          />
          {errors.ownerFirstName && <p className="text-xs text-red-500">{errors.ownerFirstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ownerLastName">Last Name <span className="text-red-500">*</span></Label>
          <Input 
            id="ownerLastName" 
            value={formData.ownerLastName || ''} 
            onChange={(e) => updateFormData('ownerLastName', e.target.value)}
            className={errors.ownerLastName ? 'border-red-500' : ''}
            placeholder="e.g. Dela Cruz"
          />
          {errors.ownerLastName && <p className="text-xs text-red-500">{errors.ownerLastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerMobileNumber">Mobile Number <span className="text-red-500">*</span></Label>
        <Input 
          id="ownerMobileNumber" 
          value={formData.ownerMobileNumber || ''} 
          onChange={(e) => updateFormData('ownerMobileNumber', e.target.value)}
          className={errors.ownerMobileNumber ? 'border-red-500' : ''}
          placeholder="+63 900 000 0000"
          type="tel"
        />
        {errors.ownerMobileNumber && <p className="text-xs text-red-500">{errors.ownerMobileNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerResidentialAddress">Residential Address <span className="text-red-500">*</span></Label>
        <Textarea 
          id="ownerResidentialAddress" 
          value={formData.ownerResidentialAddress || ''} 
          onChange={(e) => updateFormData('ownerResidentialAddress', e.target.value)}
          className={errors.ownerResidentialAddress ? 'border-red-500' : ''}
          placeholder="Complete residential address"
        />
        {errors.ownerResidentialAddress && <p className="text-xs text-red-500">{errors.ownerResidentialAddress}</p>}
      </div>
    </div>
  );
};

export default OwnerInfoStep;