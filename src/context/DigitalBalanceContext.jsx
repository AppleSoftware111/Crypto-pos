import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useUsers } from './UserContext';
import { useAuth } from './AuthContext';

const DigitalBalanceContext = createContext();

export const useDigitalBalance = () => useContext(DigitalBalanceContext);

export const DigitalBalanceProvider = ({ children }) => {
  const { digitalBalances, updateDigitalBalance } = useUsers();
  const { currentUser, walletAddress } = useAuth();
  const { toast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [frozenAccounts, setFrozenAccounts] = useState([]); 
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  
  const [depositConfig, setDepositConfig] = useState({
      methods: {
          bank: { enabled: true, min: 10, max: 50000, feePercent: 0, feeFixed: 0 },
          card: { enabled: true, min: 10, max: 10000, feePercent: 2.5, feeFixed: 0.30 },
          wallet: { enabled: true, min: 5, max: 5000, feePercent: 1.5, feeFixed: 0 },
          remit: { enabled: true, min: 50, max: 2000, feePercent: 3, feeFixed: 5 },
          otc: { enabled: true, min: 5, max: 500, feePercent: 0, feeFixed: 1 },
          p2p: { enabled: true, min: 1, max: 100000, feePercent: 0, feeFixed: 0 },
      }
  });

  const [remittanceProviders, setRemittanceProviders] = useState([
      { id: 'wu', name: 'Western Union', status: 'active', rates: { 'USD-PHP': 56.50, 'USD-EUR': 0.92 }, margin: 1.5 },
      { id: 'mg', name: 'MoneyGram', status: 'active', rates: { 'USD-PHP': 56.40, 'USD-EUR': 0.91 }, margin: 1.2 },
      { id: 'remitly', name: 'Remitly', status: 'active', rates: { 'USD-PHP': 56.60, 'USD-EUR': 0.93 }, margin: 1.0 },
  ]);

  const [riskRules, setRiskRules] = useState([
      { id: 1, name: 'High Velocity', condition: '> 5 tx/hour', score: 20, enabled: true },
      { id: 2, name: 'Large Amount', condition: '> $10,000', score: 30, enabled: true },
      { id: 3, name: 'New Device', condition: 'Device mismatch', score: 10, enabled: true },
  ]);

  const [userRiskScores, setUserRiskScores] = useState({});

  const getTxKey = useCallback((addr) => {
      return `user_${addr}_transactions`;
  }, []);

  useEffect(() => {
    if (walletAddress) {
        const key = getTxKey(walletAddress);
        const storedTx = JSON.parse(localStorage.getItem(key) || '[]');
        setTransactions(storedTx);
    } else {
        setTransactions([]);
    }
    
    setAdminLogs(JSON.parse(localStorage.getItem('omara_admin_logs') || '[]'));
    setFrozenAccounts(JSON.parse(localStorage.getItem('omara_frozen_accounts') || '[]'));
    setPendingDeposits(JSON.parse(localStorage.getItem('omara_pending_deposits') || '[]'));
    setPendingWithdrawals(JSON.parse(localStorage.getItem('omara_pending_withdrawals') || '[]'));
  }, [walletAddress, getTxKey]);

  const logTransaction = useCallback((txData) => {
    if (!walletAddress) return;

    const newTx = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      status: txData.status || 'Completed',
      walletAddress: walletAddress,
      ...txData
    };
    
    if (newTx.status === 'Completed') {
        setTransactions(prev => {
            const updated = [newTx, ...prev];
            localStorage.setItem(getTxKey(walletAddress), JSON.stringify(updated));
            return updated;
        });
    }
    return newTx;
  }, [walletAddress, getTxKey]);

  const logAdminAction = useCallback((action, target, details, adminName) => {
      const log = {
        id: `LOG-${Date.now()}`,
        action,
        targetUser: target,
        details,
        admin: adminName || 'Admin',
        timestamp: new Date().toISOString()
      };
      setAdminLogs(prev => {
        const updated = [log, ...prev];
        localStorage.setItem('omara_admin_logs', JSON.stringify(updated));
        return updated;
      });
  }, []);

  const deposit = useCallback(async (amount, currency, method, details) => {
    if (frozenAccounts.includes(currentUser?.email)) throw new Error("Account is frozen. Contact support.");
    if (!walletAddress) throw new Error("Wallet not connected");

    const config = depositConfig.methods[method];
    if (amount < config.min || amount > config.max) {
        throw new Error(`Amount must be between ${config.min} and ${config.max}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (['bank', 'remit', 'otc'].includes(method)) {
        const newDeposit = {
            id: `DEP-${Date.now()}`,
            user: currentUser?.email,
            walletAddress: walletAddress,
            amount: parseFloat(amount),
            currency,
            method,
            status: 'Pending',
            timestamp: new Date().toISOString(),
            details
        };
        setPendingDeposits(prev => {
            const updated = [newDeposit, ...prev];
            localStorage.setItem('omara_pending_deposits', JSON.stringify(updated));
            return updated;
        });
        toast({ title: "Deposit Pending", description: "Your deposit is awaiting admin approval." });
    } else {
        updateDigitalBalance(currency, parseFloat(amount));
        logTransaction({
            type: 'Deposit',
            amount: parseFloat(amount),
            currency,
            method,
            details,
            direction: 'Inbound',
            user: currentUser?.email
        });
        toast({ title: "Deposit Successful", description: `${currency} ${amount} credited via ${method}` });
    }
  }, [currentUser, walletAddress, frozenAccounts, depositConfig, updateDigitalBalance, logTransaction, toast]);

  const withdraw = useCallback(async (amount, currency, method, details) => {
    if (frozenAccounts.includes(currentUser?.email)) throw new Error("Account is frozen.");
    if (!walletAddress) throw new Error("Wallet not connected");

    const currentBal = digitalBalances[currency] || 0;
    if (currentBal < parseFloat(amount)) {
        throw new Error(`Insufficient ${currency} balance. Available: ${currentBal.toFixed(2)}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    updateDigitalBalance(currency, -parseFloat(amount));

    if (amount > 1000) { 
         const newWithdrawal = {
            id: `WDL-${Date.now()}`,
            user: currentUser?.email,
            walletAddress: walletAddress,
            amount: parseFloat(amount),
            currency,
            method,
            status: 'Pending Review',
            timestamp: new Date().toISOString(),
            details
        };
        setPendingWithdrawals(prev => {
            const updated = [newWithdrawal, ...prev];
            localStorage.setItem('omara_pending_withdrawals', JSON.stringify(updated));
            return updated;
        });
        toast({ title: "Withdrawal Under Review", description: "Large withdrawals require manual approval." });
    } else {
        logTransaction({
            type: 'Withdrawal',
            amount: parseFloat(amount),
            currency,
            method,
            details,
            direction: 'Outbound',
            user: currentUser?.email
        });
        toast({ title: "Withdrawal Initiated", description: `${currency} ${amount} sent to ${method}` });
    }
  }, [currentUser, walletAddress, digitalBalances, frozenAccounts, updateDigitalBalance, logTransaction, toast]);

  const transfer = useCallback(async (amount, currency, recipientId) => {
     if (frozenAccounts.includes(currentUser?.email)) throw new Error("Account is frozen.");
     if (!walletAddress) throw new Error("Wallet not connected");

     const currentBal = digitalBalances[currency] || 0;
     if (currentBal < parseFloat(amount)) {
         throw new Error(`Insufficient ${currency} balance.`);
     }

     await new Promise(resolve => setTimeout(resolve, 1000));

     updateDigitalBalance(currency, -parseFloat(amount));
     
     logTransaction({
       type: 'Transfer',
       amount: parseFloat(amount),
       currency,
       details: { recipient: recipientId },
       direction: 'Outbound',
       user: currentUser?.email
     });

     toast({ title: "Transfer Sent", description: `Sent ${currency} ${amount} to ${recipientId}` });
  }, [currentUser, walletAddress, digitalBalances, frozenAccounts, updateDigitalBalance, logTransaction, toast]);

  const approveDeposit = useCallback((id) => {
      const deposit = pendingDeposits.find(d => d.id === id);
      if (!deposit) return;

      const updatedPending = pendingDeposits.filter(d => d.id !== id);
      setPendingDeposits(updatedPending);
      localStorage.setItem('omara_pending_deposits', JSON.stringify(updatedPending));
      
      logAdminAction('Approve Deposit', deposit.user, `Approved ${deposit.currency} ${deposit.amount}`, 'Admin');
      toast({ title: "Deposit Approved", description: "Funds credited to user." });

  }, [pendingDeposits, logAdminAction, toast]);

  const rejectDeposit = useCallback((id, reason) => {
      const deposit = pendingDeposits.find(d => d.id === id);
      if (!deposit) return;

      const updatedPending = pendingDeposits.filter(d => d.id !== id);
      setPendingDeposits(updatedPending);
      localStorage.setItem('omara_pending_deposits', JSON.stringify(updatedPending));
      
      logAdminAction('Reject Deposit', deposit.user, `Rejected ${deposit.currency} ${deposit.amount}. Reason: ${reason}`, 'Admin');
      toast({ title: "Deposit Rejected", variant: "destructive" });
  }, [pendingDeposits, logAdminAction, toast]);

  const adminAdjustBalance = useCallback((userEmail, amount, currency, reason, adminName) => {
    if (currentUser?.email === userEmail) {
        updateDigitalBalance(currency, parseFloat(amount));
    }
    
    logAdminAction('Balance Adjustment', userEmail, `Adjusted ${currency} ${amount}. Reason: ${reason}`, adminName);
    toast({ title: "Balance Adjusted", description: "User balance updated." });
  }, [currentUser, updateDigitalBalance, logAdminAction, toast]);

  const toggleFreezeAccount = useCallback((userEmail, reason, adminName) => {
      let newFrozen;
      const isFrozen = frozenAccounts.includes(userEmail);
      if (isFrozen) {
          newFrozen = frozenAccounts.filter(e => e !== userEmail);
      } else {
          newFrozen = [...frozenAccounts, userEmail];
      }
      setFrozenAccounts(newFrozen);
      localStorage.setItem('omara_frozen_accounts', JSON.stringify(newFrozen));
      
      logAdminAction(isFrozen ? 'Unfreeze Account' : 'Freeze Account', userEmail, reason, adminName);
      toast({ title: isFrozen ? "Account Unfrozen" : "Account Frozen" });
  }, [frozenAccounts, logAdminAction, toast]);

  const updateRemittanceProvider = useCallback((id, updates) => {
      setRemittanceProviders(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);
  
  const updateRiskRule = useCallback((id, updates) => {
      setRiskRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const value = useMemo(() => ({
      transactions,
      adminLogs,
      frozenAccounts,
      pendingDeposits,
      pendingWithdrawals,
      depositConfig,
      remittanceProviders,
      riskRules,
      userRiskScores,
      deposit,
      withdraw,
      transfer,
      adminAdjustBalance,
      toggleFreezeAccount,
      approveDeposit,
      rejectDeposit,
      updateRemittanceProvider,
      updateRiskRule
  }), [
      transactions,
      adminLogs,
      frozenAccounts,
      pendingDeposits,
      pendingWithdrawals,
      depositConfig,
      remittanceProviders,
      riskRules,
      userRiskScores,
      deposit,
      withdraw,
      transfer,
      adminAdjustBalance,
      toggleFreezeAccount,
      approveDeposit,
      rejectDeposit,
      updateRemittanceProvider,
      updateRiskRule
  ]);

  return (
    <DigitalBalanceContext.Provider value={value}>
      {children}
    </DigitalBalanceContext.Provider>
  );
};