import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useBusiness } from './BusinessContext';
import { useToast } from '@/components/ui/use-toast';
import SwitchModeModal from '@/components/merchant/SwitchModeModal';
import { getTransactions as fetchPOSTransactions } from '@/lib/posApi';
import { 
    demoTransactions, 
    demoPayouts, 
    demoCustomers, 
    demoInvoices, 
    demoProducts, 
    demoAnalytics 
} from '@/data/demoData';

/** Map POS API payment to the transaction shape expected by TransactionsPage */
function mapPaymentToTransaction(payment) {
    const status = payment.confirmed === 1 || payment.status === 'confirmed' ? 'Completed' : (payment.status === 'failed' ? 'Failed' : 'Pending');
    return {
        id: payment.payment_id || payment.id || '',
        date: payment.created_at || new Date().toISOString(),
        customer: 'POS Customer',
        type: 'Payment',
        method: payment.coin_name || payment.symbol || payment.method || '—',
        status,
        amount: typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0
    };
}

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
    const [liveTransactionsError, setLiveTransactionsError] = useState(null);
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

    // Fetch live transactions from POS API when in live mode (supports abort signal to avoid AbortError on unmount/Strict Mode)
    const loadLiveData = useCallback(async (abortSignal = null) => {
        if (!businessProfile) return;
        setLoading(true);
        setLiveTransactionsError(null);
        const defaultAnalytics = {
            revenue: { total: 0, trend: 0 },
            transactions: { total: 0, trend: 0 },
            customers: { total: 0, trend: 0 },
            conversionRate: 0,
            chartData: []
        };
        try {
            const res = await fetchPOSTransactions(50, 0, abortSignal);
            const payments = res?.transactions || [];
            const mapped = Array.isArray(payments) ? payments.map(mapPaymentToTransaction) : [];
            const totalAmount = mapped.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0);
            setRealData({
                transactions: mapped,
                payouts: [],
                customers: [],
                invoices: [],
                products: [],
                analytics: {
                    ...defaultAnalytics,
                    transactions: { total: mapped.length, trend: 0 },
                    revenue: { total: totalAmount, trend: 0 }
                }
            });
        } catch (err) {
            if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return;
            setRealData(prev => ({
                ...prev,
                transactions: [],
                analytics: prev.analytics || defaultAnalytics
            }));
            setLiveTransactionsError(err?.response?.status === 401 ? 'Sign in to POS to see live transactions here.' : 'Could not load transactions.');
        } finally {
            setLoading(false);
        }
    }, [businessProfile]);

    useEffect(() => {
        if (!businessProfile) return;
        if (mode === 'live') {
            const controller = new AbortController();
            loadLiveData(controller.signal);
            return () => controller.abort();
        } else {
            setLoading(false);
            setLiveTransactionsError(null);
        }
    }, [businessProfile, mode, loadLiveData]);

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


    const refreshData = useCallback(() => {
        if (mode === 'live' && businessProfile) {
            loadLiveData();
        } else {
            setLoading(false);
        }
    }, [mode, businessProfile, loadLiveData]);

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
        refreshData,
        liveTransactionsError
    }), [currentData, loading, mode, isModeLive, isModeDemo, switchToLiveMode, switchToDemoMode, addTransaction, addPayout, refreshData, liveTransactionsError]);

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