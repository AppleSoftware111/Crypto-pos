import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BankWithdrawalForm = ({ onSubmit, isProcessing }) => (
    <div className="space-y-4">
        <div><Label>Bank Name</Label><Input placeholder="e.g. Chase, HSBC" /></div>
        <div><Label>Account Number</Label><Input placeholder="Account #" /></div>
        <div><Label>Routing / SWIFT</Label><Input placeholder="Routing" /></div>
        <div><Label>Amount</Label><Input type="number" onChange={(e) => onSubmit(e.target.value)} /></div>
        <Button className="w-full" disabled={isProcessing}>Withdraw to Bank</Button>
    </div>
);

export default BankWithdrawalForm;