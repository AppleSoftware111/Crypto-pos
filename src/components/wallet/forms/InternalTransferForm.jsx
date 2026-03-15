import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InternalTransferForm = ({ onSubmit, isProcessing }) => {
    const [amount, setAmount] = useState(0);
    const [recipient, setRecipient] = useState('');

    return (
        <div className="space-y-4">
            <div>
                <Label>Recipient (Email or Wallet ID)</Label>
                <Input placeholder="user@example.com" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div>
                <Label>Amount</Label>
                <Input type="number" placeholder="0.00" onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button className="w-full" disabled={isProcessing} onClick={() => onSubmit(amount, recipient)}>
                Send Instantly
            </Button>
        </div>
    );
};

export default InternalTransferForm;