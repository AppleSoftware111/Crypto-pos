import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BankDepositForm = ({ onSubmit, isProcessing }) => (
    <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Transfer Instructions</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Bank: <span className="font-mono font-bold">Omara Treasury Bank</span></p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Account: <span className="font-mono font-bold">1234-5678-9012</span></p>
            <p className="text-sm text-blue-600 dark:text-blue-400">Reference: <span className="font-mono font-bold">YOUR-WALLET-ID</span></p>
        </div>
        <div>
            <Label>Amount to Deposit</Label>
            <Input type="number" placeholder="0.00" min="10" onChange={(e) => onSubmit(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">Please enter the exact amount you transferred.</p>
        </div>
        <Button className="w-full" disabled={isProcessing}>I Have Made The Transfer</Button>
    </div>
);

export default BankDepositForm;