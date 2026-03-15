import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

const OTCDepositForm = ({ onSubmit, isProcessing }) => (
    <div className="flex flex-col items-center space-y-6 text-center">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
            <QrCode className="w-32 h-32" />
        </div>
        <div>
            <h4 className="font-semibold">Scan at 7-Eleven</h4>
            <p className="text-sm text-muted-foreground">Show this barcode to the cashier to deposit cash instantly.</p>
        </div>
        <Button className="w-full" onClick={() => onSubmit(50)} disabled={isProcessing}>Simulate Payment</Button>
    </div>
);

export default OTCDepositForm;