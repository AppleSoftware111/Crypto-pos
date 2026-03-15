import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from './AuthContext';
import { useBusiness } from './BusinessContext';
import { blockchainConfig } from '@/config/blockchainConfig';
import { useChainId } from 'wagmi';

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { walletAddress, selectedBlockchainId, setSelectedBlockchainId } = useAuth();
  const { selectedAccountType, businessProfile } = useBusiness(); 
  const chainId = useChainId();
  
  const [digitalBalances, setDigitalBalances] = useState({ USD: 0, PHP: 0, EUR: 0 });
  const [loading, setLoading] = useState(true);
  const [currentNativeToken, setCurrentNativeToken] = useState('ETH');
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [userCountry, setUserCountry] = useState('PH'); // Default to PH for this demo
  const [currentChain, setCurrentChain] = useState(chainId);

  const { toast } = useToast();

  useEffect(() => {
    setCurrentChain(chainId);
  }, [chainId]);

  const updateUserCountry = useCallback((countryCode) => {
    setUserCountry(countryCode);
    // Persist if needed
    localStorage.setItem('omara_user_country', countryCode);
  }, []);

  // Initialize Country
  useEffect(() => {
    const stored = localStorage.getItem('omara_user_country');
    if (stored) setUserCountry(stored);
  }, []);

  // Memoize getBalanceKey to prevent recreation on every render
  const getBalanceKey = useCallback((addr) => {
      const prefix = selectedAccountType === 'business' && businessProfile?.id
        ? `biz_${businessProfile.id}` 
        : `user_${addr}`;
      return `${prefix}_balance`;
  }, [selectedAccountType, businessProfile?.id]);

  const initializeWalletBalance = useCallback((key) => {
      const initial = { USD: 0, PHP: 0, EUR: 0 };
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
  }, []);

  // Load persistence on mount & when wallet/account changes
  useEffect(() => {
    if (walletAddress) {
        const key = getBalanceKey(walletAddress);
        const savedBalances = localStorage.getItem(key);
        
        if (savedBalances) {
            try {
                setDigitalBalances(JSON.parse(savedBalances));
            } catch (e) {
                setDigitalBalances(initializeWalletBalance(key));
            }
        } else {
            setDigitalBalances(initializeWalletBalance(key));
        }
    } else {
        setDigitalBalances({ USD: 0, PHP: 0, EUR: 0 });
    }

    setLoading(false);
  }, [walletAddress, getBalanceKey, initializeWalletBalance]);

  // Sync Native Token with Blockchain Selection
  useEffect(() => {
    if (selectedBlockchainId) {
        const chain = blockchainConfig[selectedBlockchainId];
        if (chain) {
            setCurrentNativeToken(chain.currency);
        }
    }
  }, [selectedBlockchainId]);

  const switchBlockchain = useCallback(async (targetChainId) => {
    if (!window.ethereum) return { success: false, error: "No wallet" };
    setIsSwitchingChain(true);
    try {
         // Simulate switch delay
         await new Promise(resolve => setTimeout(resolve, 500));
         setSelectedBlockchainId(targetChainId);
         return { success: true };
    } catch(e) {
        return { success: false, error: e.message };
    } finally {
        setIsSwitchingChain(false);
    }
  }, [setSelectedBlockchainId]);

  const updateDigitalBalance = useCallback((currency, amount) => {
    if (!walletAddress) return;

    setDigitalBalances(prev => {
        const currentAmount = prev[currency] || 0;
        const newAmount = currentAmount + amount;
        
        const newBalances = { ...prev, [currency]: newAmount };
        const key = getBalanceKey(walletAddress);
        localStorage.setItem(key, JSON.stringify(newBalances));
        return newBalances;
    });
  }, [walletAddress, getBalanceKey]);

  const value = useMemo(() => ({
    loading,
    digitalBalances,
    updateDigitalBalance,
    currentNativeToken,
    switchBlockchain,
    isSwitchingChain,
    isBusinessAccount: selectedAccountType === 'business',
    currentBusiness: businessProfile,
    userCountry,
    updateUserCountry,
    currentChain
  }), [
    loading, 
    digitalBalances, 
    updateDigitalBalance, 
    currentNativeToken,
    switchBlockchain,
    isSwitchingChain,
    selectedAccountType,
    businessProfile,
    userCountry,
    updateUserCountry,
    currentChain
  ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};