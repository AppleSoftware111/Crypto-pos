import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OnlineWalletDepositForm = ({ onSubmit, isProcessing }) => (
    <div className="space-y-4">
        <div>
            <Label>Select Provider</Label>
            <Select>
                <SelectTrigger><SelectValue placeholder="Choose provider" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="wise">Wise</SelectItem>
                    <SelectItem value="revolut">Revolut</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button className="w-full" onClick={() => onSubmit(100)} disabled={isProcessing}>Connect & Pay</Button>
    </div>
);

export default OnlineWalletDepositForm;