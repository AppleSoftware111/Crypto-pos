import React from 'react';
import { Building2, CreditCard, Globe, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const methods = [
    { id: 'bank', name: 'Bank Withdrawal', icon: Building2, desc: '2-3 Business Days' },
    { id: 'card', name: 'Card Payout', icon: CreditCard, desc: 'Visa Direct (Instant)' },
    { id: 'remit', name: 'Cash Pickup', icon: Globe, desc: 'Global Agents' },
    { id: 'internal', name: 'Internal Transfer', icon: Send, desc: 'Free & Instant' },
];

const WithdrawalMethodSelector = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = selected === method.id;
            
            return (
                <Card 
                    key={method.id}
                    className={`cursor-pointer transition-all border-2 ${isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:border-gray-200'} shadow-sm`}
                    onClick={() => onSelect(method.id)}
                >
                    <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{method.name}</p>
                            <p className="text-xs text-muted-foreground">{method.desc}</p>
                        </div>
                    </CardContent>
                </Card>
            );
        })}
    </div>
  );
};

export default WithdrawalMethodSelector;