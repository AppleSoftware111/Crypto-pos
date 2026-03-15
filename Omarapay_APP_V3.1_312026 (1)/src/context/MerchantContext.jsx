import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useBusiness } from './BusinessContext';
import { useToast } from '@/components/ui/use-toast';
import SwitchModeModal from '@/components/merchant/SwitchModeModal';
import { 
    demoTransactions, 
    demoPayouts, 
    demoCustomers, 
    demoInvoices, 
    demoProducts, 
    demoAnalytics 
} from '@/data/demoData';

const MerchantContext = createContext();

export const useMerchant = () => useContext(MerchantContext);

export const MerchantProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const { businessProfile } = useBusiness();
    const { toast } = useToast();
    
    // Mode State
    const [mode, setMode] = useState(() => localStorage.getItem('omara_merchant_mode') || 'demo');
    const [showSwitchModal, setShowSwitchModal] = useState(false);

    // Data State
    const [loading, setLoading] = useState(true);
    const [realData, setRealData] = useState({
        transactions: [],
        payouts: [],
        customers: [],
        invoices: [],
        products: [],
        analytics: null
    });

    // Helpers
    const isModeLive = useCallback(() => mode === 'live', [mode]);
    const isModeDemo = useCallback(() => mode === 'demo', [mode]);

    // Mode Switching Logic
    const handleSwitchToLive = useCallback(() => {
        setMode('live');
        localStorage.setItem('omara_merchant_mode', 'live');
        toast({
            title: "Switched to Live Mode",
            description: "You are now viewing real data. Transactions are live.",
            variant: "destructive", // Use destructive/warning color for Live mode awareness
        });
    }, [toast]);

    const switchToLiveMode = useCallback(() => {
        if (mode === 'live') return;
        setShowSwitchModal(true);
    }, [mode]);

    const switchToDemoMode = useCallback(() => {
        if (mode === 'demo') return;
        setMode('demo');
        localStorage.setItem('omara_merchant_mode', 'demo');
        toast({
            title: "Switched to Demo Mode",
            description: "You are now in the sandbox environment.",
            className: "bg-blue-50 border-blue-200 text-blue-900",
        });
    }, [mode, toast]);

    // Load Real Data (Simulated API Call)
    useEffect(() => {
        if (businessProfile) {
            setLoading(true);
            // Simulate fetching real data from API
            // In a real app, this would be an API call dependent on the businessProfile.id
            setTimeout(() => {
                setRealData({
                    transactions: [], // Initially empty for new merchants
                    payouts: [],
                    customers: [],
                    invoices: [],
                    products: [],
                    analytics: {
                        revenue: { total: 0, trend: 0 },
                        transactions: { total: 0, trend: 0 },
                        customers: { total: 0, trend: 0 },
                        conversionRate: 0,
                        chartData: []
                    }
                });
                setLoading(false);
            }, 800);
        }
    }, [businessProfile]);

    // Computed Data based on Mode
    const currentData = useMemo(() => {
        if (mode === 'demo') {
            return {
                transactions: demoTransactions,
                payouts: demoPayouts,
                customers: demoCustomers,
                invoices: demoInvoices,
                products: demoProducts,
                analytics: demoAnalytics
            };
        } else {
            return realData;
        }
    }, [mode, realData]);

    // Action to add simulated item (for Payouts/Transactions in demo/live)
    const addTransaction = useCallback((transaction) => {
        if (mode === 'demo') {
            // In demo mode, we don't actually persist, or we could update a local state for the session
            // For now, we'll just toast
            console.log("Added demo transaction", transaction);
        } else {
            setRealData(prev => ({
                ...prev,
                transactions: [transaction, ...prev.transactions]
            }));
        }
    }, [mode]);

    const addPayout = useCallback((payout) => {
        if (mode === 'demo') {
             // For demo, we might want to simulate it appearing in the list temporarily
             console.log("Added demo payout", payout);
        } else {
            setRealData(prev => ({
                ...prev,
                payouts: [payout, ...prev.payouts]
            }));
        }
    }, [mode]);


    const value = useMemo(() => ({
        ...currentData,
        loading,
        mode,
        isModeLive,
        isModeDemo,
        switchToLiveMode,
        switchToDemoMode,
        addTransaction,
        addPayout,
        refreshData: () => setLoading(true) // simplistic refresh
    }), [currentData, loading, mode, isModeLive, isModeDemo, switchToLiveMode, switchToDemoMode, addTransaction, addPayout]);

    return (
        <MerchantContext.Provider value={value}>
            {children}
            <SwitchModeModal 
                open={showSwitchModal} 
                onOpenChange={setShowSwitchModal} 
                onConfirm={handleSwitchToLive} 
            />
        </MerchantContext.Provider>
    );
};