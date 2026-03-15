import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { usePaymentProviders } from '@/context/PaymentProviderContext';
import { Banknote, Smartphone, Bitcoin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MethodCard = ({ icon: Icon, title, description, active, onClick, providers = [] }) => (
  <Card 
    className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${active ? 'border-primary ring-1 ring-primary' : ''}`}
    onClick={onClick}
  >
    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
      <div className={`p-4 rounded-full ${active ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      
      {providers.length > 0 && (
          <div className="flex gap-2 mt-2">
              {providers.map(p => (
                  <div key={p.id} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
                      {p.logo && <img src={p.logo} alt="" className="w-3 h-3" />}
                      {p.name}
                  </div>
              ))}
          </div>
      )}
    </CardContent>
  </Card>
);

const DepositMethodSelector = ({ selectedMethod, onSelectMethod }) => {
  const { getEnabledProviders } = usePaymentProviders();
  const activeProviders = getEnabledProviders();
  
  const eWallets = activeProviders.filter(p => p.type === 'E-WALLET');
  const banks = activeProviders.filter(p => p.type === 'BANK');
  const cryptos = activeProviders.filter(p => p.type === 'CRYPTO');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <MethodCard 
        icon={Building2}
        title="Bank Transfer"
        description="Direct transfer from your bank account"
        active={selectedMethod === 'bank'}
        onClick={() => onSelectMethod('bank')}
        providers={banks}
      />
      <MethodCard 
        icon={Smartphone}
        title="E-Wallets"
        description="Maya, GCash and other mobile wallets"
        active={selectedMethod === 'ewallet'}
        onClick={() => onSelectMethod('ewallet')}
        providers={eWallets}
      />
      <MethodCard 
        icon={Bitcoin}
        title="Crypto Deposit"
        description="Deposit USDT, USDC, or AVAX"
        active={selectedMethod === 'crypto'}
        onClick={() => onSelectMethod('crypto')}
        providers={cryptos}
      />
    </div>
  );
};

export default DepositMethodSelector;