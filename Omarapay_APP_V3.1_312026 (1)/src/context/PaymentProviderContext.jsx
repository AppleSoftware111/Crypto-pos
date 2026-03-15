import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_PAYMENT_PROVIDERS } from '@/lib/businessSchema';
import { useToast } from '@/components/ui/use-toast';

const PaymentProviderContext = createContext(null);

export const usePaymentProviders = () => {
    const context = useContext(PaymentProviderContext);
    if (!context) throw new Error('usePaymentProviders must be used within a PaymentProviderProvider');
    return context;
};

export const PaymentProviderProvider = ({ children }) => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const storedProviders = localStorage.getItem('omara_payment_providers');
        if (storedProviders) {
            setProviders(JSON.parse(storedProviders));
        } else {
            localStorage.setItem('omara_payment_providers', JSON.stringify(DEFAULT_PAYMENT_PROVIDERS));
            setProviders(DEFAULT_PAYMENT_PROVIDERS);
        }
        setLoading(false);
    }, []);

    const updateProvider = useCallback((providerId, updates) => {
        setProviders(prev => {
            const newProviders = prev.map(p => p.id === providerId ? { ...p, ...updates } : p);
            localStorage.setItem('omara_payment_providers', JSON.stringify(newProviders));
            return newProviders;
        });
        
        toast({
            title: "Provider Updated",
            description: "Payment provider configuration has been saved.",
        });
    }, [toast]);

    const toggleProvider = useCallback((providerId) => {
        setProviders(prev => {
            const newProviders = prev.map(p => p.id === providerId ? { ...p, enabled: !p.enabled } : p);
            localStorage.setItem('omara_payment_providers', JSON.stringify(newProviders));
            
            const provider = newProviders.find(p => p.id === providerId);
            toast({
                title: provider.enabled ? "Provider Enabled" : "Provider Disabled",
                description: `${provider.name} is now ${provider.enabled ? 'active' : 'inactive'}.`,
            });
            return newProviders;
        });
    }, [toast]);

    const getEnabledProviders = useCallback(() => {
        return providers.filter(p => p.enabled);
    }, [providers]);

    const value = useMemo(() => ({
        providers,
        loading,
        updateProvider,
        toggleProvider,
        getEnabledProviders
    }), [providers, loading, updateProvider, toggleProvider, getEnabledProviders]);

    return <PaymentProviderContext.Provider value={value}>{children}</PaymentProviderContext.Provider>;
};