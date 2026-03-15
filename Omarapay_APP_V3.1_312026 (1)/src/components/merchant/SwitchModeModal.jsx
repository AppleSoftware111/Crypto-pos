import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Fingerprint } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

const SwitchModeModal = ({ open, onOpenChange, onConfirm }) => {
    const [acknowledged, setAcknowledged] = useState(false);
    const { businessProfile } = useBusiness();

    const handleConfirm = () => {
        if (acknowledged) {
            onConfirm();
            onOpenChange(false);
            setAcknowledged(false); // Reset for next time
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-orange-600 mb-2">
                        <AlertTriangle className="h-6 w-6" />
                        <DialogTitle className="text-xl">Switch to Live Account</DialogTitle>
                    </div>
                    <DialogDescription>
                        You are about to switch to Live Mode. Transactions performed in Live Mode involve real money and cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                    <div className="bg-gray-50 p-3 rounded-md border text-sm">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-muted-foreground">Merchant Name:</span>
                            <span className="font-medium">{businessProfile?.businessName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Merchant ID:</span>
                            <span className="font-mono text-xs flex items-center">
                                <Fingerprint className="w-3 h-3 mr-1" />
                                {businessProfile?.merchantId?.substring(0, 12)}...
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2 pt-2">
                        <Checkbox 
                            id="live-mode-ack" 
                            checked={acknowledged}
                            onCheckedChange={setAcknowledged}
                        />
                        <Label 
                            htmlFor="live-mode-ack" 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-0.5"
                        >
                            I understand that all actions in Live Mode are real and involve actual funds.
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirm} 
                        disabled={!acknowledged}
                        className={acknowledged ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                    >
                        Yes, Switch to Live
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SwitchModeModal;