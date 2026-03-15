import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RemittancePayoutForm = ({ onSubmit, isProcessing }) => (
    <div className="space-y-4">
        <div><Label>Recipient Name</Label><Input placeholder="Full legal name" /></div>
        <div><Label>Country</Label><Input placeholder="Destination Country" /></div>
        <div><Label>Amount</Label><Input type="number" onChange={(e) => onSubmit(e.target.value)} /></div>
        <Button className="w-full" disabled={isProcessing}>Send Cash Pickup</Button>
    </div>
);

export default RemittancePayoutForm;