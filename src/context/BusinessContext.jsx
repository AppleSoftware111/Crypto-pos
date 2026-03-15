import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';
import { businessStorageService } from '@/lib/businessStorageService';
import { STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage } from '@/lib/localStorageUtils';

const BusinessContext = createContext(null);

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) throw new Error('useBusiness must be used within a BusinessProvider');
    return context;
};

export const BusinessProvider = ({ children }) => {
    const { address: walletAddress, isConnected } = useAccount();
    const [userUUID, setUserUUID] = useState('');
    const [businessProfile, setBusinessProfile] = useState(null); 
    const [userBusinesses, setUserBusinesses] = useState([]); 
    
    const [selectedAccountType, setSelectedAccountType] = useState(() => {
        return getFromLocalStorage(STORAGE_KEYS.ACCOUNT_TYPE, 'personal');
    });
    
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // --- Initialize UUID ---
    useEffect(() => {
        const uuid = businessStorageService.generateUserUUID();
        setUserUUID(uuid);
    }, []);

    // --- Load Merchants for Current Context ---
    const loadMerchantsForCurrentWallet = useCallback(() => {
        if (!userUUID || !walletAddress) {
            setUserBusinesses([]);
            return;
        }
        
        const merchants = businessStorageService.getMerchantsByUUIDAndWallet(userUUID, walletAddress);
        
        // Only update if different to prevent loops
        setUserBusinesses(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(merchants)) return merchants;
            return prev;
        });

        // Validate currently selected profile
        if (selectedAccountType === 'business') {
            const currentMid = getFromLocalStorage(STORAGE_KEYS.SELECTED_BUSINESS);
            const stillHasAccess = merchants.find(m => m.merchantId === currentMid);
            
            if (stillHasAccess) {
                setBusinessProfile(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(stillHasAccess)) return stillHasAccess;
                    return prev;
                });
            } else {
                console.warn("Lost access to selected merchant. Switching to personal.");
                setBusinessProfile(null);
                setSelectedAccountType('personal');
                saveToLocalStorage(STORAGE_KEYS.ACCOUNT_TYPE, 'personal');
            }
        }
    }, [userUUID, walletAddress, selectedAccountType]);

    // --- Effect: React to Wallet/UUID Changes ---
    useEffect(() => {
        setLoading(true);
        if (isConnected && walletAddress && userUUID) {
            loadMerchantsForCurrentWallet();
        } else {
            setUserBusinesses([]);
            setBusinessProfile(null);
            if (selectedAccountType === 'business') {
                setSelectedAccountType('personal');
            }
        }
        setLoading(false);
    }, [isConnected, walletAddress, userUUID, loadMerchantsForCurrentWallet, selectedAccountType]);


    // --- Core Actions ---

    const switchAccount = useCallback((type, mid = null) => {
        saveToLocalStorage(STORAGE_KEYS.ACCOUNT_TYPE, type);
        setSelectedAccountType(type);

        if (type === 'business') {
            if (mid) {
                const target = userBusinesses.find(m => m.merchantId === mid);
                if (target) {
                    setBusinessProfile(target);
                    saveToLocalStorage(STORAGE_KEYS.SELECTED_BUSINESS, mid);
                    toast({
                        title: "Account Switched",
                        description: `Active: ${target.businessName}`
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Access Denied",
                        description: "You do not have access to this merchant with the current wallet."
                    });
                    throw new Error("Access Denied");
                }
            } else if (userBusinesses.length > 0) {
                const active = userBusinesses[0];
                setBusinessProfile(active);
                saveToLocalStorage(STORAGE_KEYS.SELECTED_BUSINESS, active.merchantId);
            }
        } else {
            setBusinessProfile(null);
            // Toast handled in navigation helper usually, but good to have here for state confirmation
        }
    }, [userBusinesses, toast]);

    const registerBusiness = useCallback(async (formData, signature) => {
        if (!walletAddress) throw new Error("Wallet not connected");

        setLoading(true);
        try {
            const newMerchant = businessStorageService.createBusiness(formData, walletAddress, signature);
            
            // Refresh state
            loadMerchantsForCurrentWallet();
            
            setBusinessProfile(newMerchant);
            saveToLocalStorage(STORAGE_KEYS.SELECTED_BUSINESS, newMerchant.merchantId);
            saveToLocalStorage(STORAGE_KEYS.ACCOUNT_TYPE, 'business');
            setSelectedAccountType('business');
            
            return newMerchant;
        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [walletAddress, loadMerchantsForCurrentWallet]);

    // --- Helper Functions (Task 1 & 6) ---

    const switchToPersonalAccount = useCallback(() => {
        switchAccount('personal');
    }, [switchAccount]);

    const getPersonalDashboardRoute = useCallback(() => {
        return "/wallet";
    }, []);

    const navigateToPersonalDashboard = useCallback(async (navigate) => {
        if (!navigate) return;
        setLoading(true);
        try {
            switchToPersonalAccount();
            navigate(getPersonalDashboardRoute());
            toast({ title: "Switched to Personal Account", description: "You are now viewing your personal wallet." });
        } catch (e) {
            console.error("Navigation failed", e);
            toast({ variant: "destructive", title: "Navigation Failed" });
        } finally {
            setLoading(false);
        }
    }, [switchToPersonalAccount, getPersonalDashboardRoute, toast]);

    const navigateToMerchantDashboard = useCallback(async (navigate, merchantId) => {
        if (!navigate || !merchantId) return;
        setLoading(true);
        try {
            switchAccount('business', merchantId);
            navigate('/merchant/dashboard');
        } catch (e) {
            console.error("Merchant navigation failed", e);
        } finally {
            setLoading(false);
        }
    }, [switchAccount]);

    const value = useMemo(() => ({
        userUUID,
        walletAddress,
        businessProfile, 
        userBusinesses, 
        selectedAccountType, 
        loading,
        switchAccount,
        registerBusiness,
        refreshBusinesses: loadMerchantsForCurrentWallet,
        validateMerchantAccess: (mid) => businessStorageService.validateMerchantAccess(userUUID, walletAddress, mid),
        // New Helpers
        switchToPersonalAccount,
        getPersonalDashboardRoute,
        navigateToPersonalDashboard,
        navigateToMerchantDashboard
    }), [
        userUUID,
        walletAddress,
        businessProfile, 
        userBusinesses, 
        selectedAccountType,
        loading,
        switchAccount, 
        registerBusiness, 
        loadMerchantsForCurrentWallet,
        switchToPersonalAccount,
        getPersonalDashboardRoute,
        navigateToPersonalDashboard,
        navigateToMerchantDashboard
    ]);

    return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};