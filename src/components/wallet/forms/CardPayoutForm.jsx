import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CardPayoutForm = ({ onSubmit, isProcessing }) => (
    <div className="space-y-4">
        <div><Label>Card Number (Visa/MC)</Label><Input placeholder="0000 0000 0000 0000" /></div>
        <div><Label>Amount</Label><Input type="number" onChange={(e) => onSubmit(e.target.value)} /></div>
        <Button className="w-full" disabled={isProcessing}>Instant Payout</Button>
    </div>
);

export default CardPayoutForm;