import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/context/UserContext';
import { getFiatRates } from '@/lib/priceCache';

const CurrencyConverter = () => {
  const { digitalBalances } = useUsers();
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  const [rates, setRates] = useState({ USD: 1, PHP: 56, EUR: 0.92 });
  const [loading, setLoading] = useState(false);

  const fetchRates = async () => {
    setLoading(true);
    const newRates = await getFiatRates();
    if (newRates && newRates.USD) {
        setRates(newRates);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Normalize everything to USD first
  const totalValueUSD = 
    (digitalBalances.USD || 0) + 
    ((digitalBalances.PHP || 0) / (rates.PHP || 56)) + 
    ((digitalBalances.EUR || 0) / (rates.EUR || 0.92));

  // Then convert to display currency
  const convertedValue = totalValueUSD * (rates[displayCurrency] || 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Digital Value</CardTitle>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fetchRates}>
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
            {displayCurrency === 'USD' && '$'}
            {displayCurrency === 'EUR' && '€'}
            {displayCurrency === 'PHP' && '₱'}
            {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Combined value (Real-time Rates)
        </p>
        
        <div className="flex gap-2">
            {['USD', 'PHP', 'EUR'].map(curr => (
                <Button 
                    key={curr}
                    variant={displayCurrency === curr ? 'default' : 'outline'}
                    size="xs"
                    className="h-7 text-xs"
                    onClick={() => setDisplayCurrency(curr)}
                >
                    {curr}
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;