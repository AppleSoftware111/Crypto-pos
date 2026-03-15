import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle } from 'lucide-react';

const BusinessRegistrationStep = ({ formData, updateFormData }) => {
  const hasRegistration = formData.hasBusinessRegistration === 'yes';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <Label className="text-base font-semibold">Do you have a valid business registration?</Label>
        <RadioGroup 
            value={formData.hasBusinessRegistration || 'no'} 
            onValueChange={(val) => updateFormData('hasBusinessRegistration', val)}
            className="flex flex-col space-y-2"
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="reg-yes" />
                <Label htmlFor="reg-yes" className="font-normal cursor-pointer">Yes, I have registered my business</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="reg-no" />
                <Label htmlFor="reg-no" className="font-normal cursor-pointer">No, not yet</Label>
            </div>
        </RadioGroup>
      </div>

      {hasRegistration && (
          <div className="space-y-2 pl-6 border-l-2 border-primary/20 animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="businessRegistrationNumber">Registration Number (Optional)</Label>
            <Input 
              id="businessRegistrationNumber" 
              value={formData.businessRegistrationNumber || ''} 
              onChange={(e) => updateFormData('businessRegistrationNumber', e.target.value)}
              placeholder="e.g. DTI / SEC / BIR Number"
            />
            <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                <AlertCircle className="w-3 h-3 mt-0.5 text-blue-500" />
                <span>You can upload your registration documents later from your Merchant Dashboard.</span>
            </div>
          </div>
      )}
    </div>
  );
};

export default BusinessRegistrationStep;