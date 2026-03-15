import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CardDepositForm = ({ onSubmit, isProcessing }) => (
    <div className="space-y-4">
        <div>
            <Label>Card Number</Label>
            <Input placeholder="0000 0000 0000 0000" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label>Expiry</Label>
                <Input placeholder="MM/YY" />
            </div>
            <div>
                <Label>CVC</Label>
                <Input placeholder="123" />
            </div>
        </div>
        <div>
            <Label>Amount</Label>
            <Input type="number" placeholder="0.00" onChange={(e) => onSubmit(e.target.value)} />
        </div>
        <Button className="w-full" disabled={isProcessing}>Pay Now</Button>
    </div>
);

export default CardDepositForm;