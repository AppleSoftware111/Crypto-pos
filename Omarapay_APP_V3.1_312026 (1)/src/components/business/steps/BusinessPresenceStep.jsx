import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Globe, Facebook } from 'lucide-react';

const BusinessPresenceStep = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
       <div className="space-y-3">
        <Label className="text-base font-semibold">How do you operate your business? <span className="text-red-500">*</span></Label>
        <RadioGroup 
            value={formData.businessOperationType || ''} 
            onValueChange={(val) => updateFormData('businessOperationType', val)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
            <div>
                <RadioGroupItem value="physical" id="op-physical" className="peer sr-only" />
                <Label 
                    htmlFor="op-physical" 
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer h-full"
                >
                    <span className="text-2xl mb-2">🏪</span>
                    Physical Store
                </Label>
            </div>
            <div>
                <RadioGroupItem value="online" id="op-online" className="peer sr-only" />
                <Label 
                    htmlFor="op-online" 
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer h-full"
                >
                    <span className="text-2xl mb-2">🌐</span>
                    Online Only
                </Label>
            </div>
             <div>
                <RadioGroupItem value="both" id="op-both" className="peer sr-only" />
                <Label 
                    htmlFor="op-both" 
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer h-full"
                >
                    <span className="text-2xl mb-2">🔄</span>
                    Both
                </Label>
            </div>
        </RadioGroup>
        {errors?.businessOperationType && <p className="text-xs text-red-500">{errors.businessOperationType}</p>}
      </div>

      <div className="pt-4 border-t space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Establish your business legitimacy (Optional)</h4>
        
        <div className="space-y-2">
            <Label htmlFor="businessWebsiteUrl" className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" /> Website URL
            </Label>
            <Input 
              id="businessWebsiteUrl" 
              value={formData.businessWebsiteUrl || ''} 
              onChange={(e) => updateFormData('businessWebsiteUrl', e.target.value)}
              placeholder="https://www.mybusiness.com"
              className={errors?.businessWebsiteUrl ? 'border-red-500' : ''}
            />
            {errors?.businessWebsiteUrl && <p className="text-xs text-red-500">{errors.businessWebsiteUrl}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="businessFacebookPage" className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-600" /> Facebook Business Page
            </Label>
            <Input 
              id="businessFacebookPage" 
              value={formData.businessFacebookPage || ''} 
              onChange={(e) => updateFormData('businessFacebookPage', e.target.value)}
              placeholder="https://facebook.com/mybusiness"
            />
        </div>
        <p className="text-xs text-muted-foreground">Adding these details helps build trust with customers.</p>
      </div>
    </div>
  );
};

export default BusinessPresenceStep;