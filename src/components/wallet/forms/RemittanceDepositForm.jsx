import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RemittanceDepositForm = ({ onSubmit, isProcessing }) => (
    <div className="space-y-4">
        <div>
            <Label>Reference Number (MTCN)</Label>
            <Input placeholder="Enter tracking number" />
        </div>
        <div>
             <Label>Sender Name</Label>
             <Input placeholder="Full legal name" />
        </div>
        <Button className="w-full" onClick={() => onSubmit(100)} disabled={isProcessing}>Claim Transfer</Button>
    </div>
);

export default RemittanceDepositForm;