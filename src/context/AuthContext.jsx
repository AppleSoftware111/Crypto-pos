import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useDisconnect } from "wagmi";
import { blockchainConfig } from "@/config/blockchainConfig";
import { isAdminWallet } from "@/config/adminConfig";
import { userIdManager } from "@/lib/userIdManager";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/localStorageUtils";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Web3 Hooks (Wagmi)
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isWalletAdmin, setIsWalletAdmin] = useState(false);
  
  // Combined User State
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [signatureVerified, setSignatureVerified] = useState(false);
  const [selectedBlockchain, setSelectedBlockchainState] = useState(null);
  const [currentWalletAddress, setCurrentWalletAddress] = useState(null);

  const { toast } = useToast();

  // Initialize from LocalStorage (Mock Session)
  useEffect(() => {
    const initAuth = async () => {
        // Check for stored user session (mock login)
        const storedUser = getFromLocalStorage('omara_session_user', null);
        
        // Check wallet
        if (address) {
            // Wallet takes precedence or merges
            const walletUser = {
                id: userIdManager.getExistingUserId() || 'wallet-user',
                wallet_address: address,
                role: isAdminWallet(address) ? 'admin' : 'user',
                authMethod: 'wallet',
                email: storedUser?.email || null, // Merge if available
                name: storedUser?.name || 'Wallet User'
            };
            
            // Only update if changed to prevent loops
            setCurrentUser(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(walletUser)) return walletUser;
                return prev;
            });
            
            setIsWalletAdmin(isAdminWallet(address));
            setCurrentWalletAddress(address);
        } else if (storedUser) {
            // Email/Password session only
            setCurrentUser(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(storedUser)) return storedUser;
                return prev;
            });
            setIsWalletAdmin(false);
            setCurrentWalletAddress(null);
        } else {
            setCurrentUser(null);
        }
        
        setLoading(false);
    };

    initAuth();
  }, [address]);

  // Handle Wallet Connection Side Effects
  useEffect(() => {
    if (address) {
       setCurrentWalletAddress(address);
       const adminCheck = isAdminWallet(address);
       setIsWalletAdmin(adminCheck);

       // Blockchain Selection Persistence
       const savedChain = localStorage.getItem(`omara_chain_${address}`);
       if (savedChain) {
           setSelectedBlockchainState(JSON.parse(savedChain));
       }

       // Signature Check
       const sessionVerified = sessionStorage.getItem(`omara_verified_${address}`);
       if (sessionVerified === 'true') {
           setSignatureVerified(true);
       } else {
           setSignatureVerified(false);
       }
    }
  }, [address]);

  const verifySignature = useCallback(async (signature) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (signature) {
          setSignatureVerified(true);
          if (address) {
              sessionStorage.setItem(`omara_verified_${address}`, 'true');
          }
          return true;
      }
      return false;
  }, [address]);

  const setSelectedBlockchain = useCallback((chain) => {
      setSelectedBlockchainState(chain);
      if (address) {
          localStorage.setItem(`omara_chain_${address}`, JSON.stringify(chain));
      }
      toast({
          title: "Network Switched",
          description: `Active network set to ${chain.name}`
      });
  }, [address, toast]);

  const getSelectedBlockchain = useCallback(() => {
      return selectedBlockchain || blockchainConfig.ethereum;
  }, [selectedBlockchain]);

  // Local Storage Login Mock
  const login = useCallback(async (email, password) => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API

      // Simple mock: accept any email/password for demo, store in LS
      const mockUser = {
          id: userIdManager.getUserId(), // Ensure consistent ID
          email,
          name: email.split('@')[0],
          role: 'user',
          authMethod: 'email'
      };

      saveToLocalStorage('omara_session_user', mockUser);
      setCurrentUser(mockUser);
      setLoading(false);
      return { user: mockUser };
  }, []);

  const register = useCallback(async (email, password, metadata) => {
      return login(email, password); // For demo, register = login
  }, [login]);

  const adminLogin = useCallback(async (email, password) => {
      if (email === 'admin@omara.com' && password === 'admin123') {
          const adminUser = {
              id: 'admin-id',
              email,
              role: 'admin',
              name: 'Super Admin',
              authMethod: 'email'
          };
          saveToLocalStorage('omara_session_user', adminUser);
          setCurrentUser(adminUser);
          setIsAdminAuthenticated(true);
          return true;
      }
      return false;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('omara_session_user');
    if (isConnected) disconnect();
    
    setSignatureVerified(false);
    setCurrentWalletAddress(null);
    setIsWalletAdmin(false);
    setCurrentUser(null);
    setIsAdminAuthenticated(false);
    
    window.location.href = "/login";
  }, [isConnected, disconnect]);

  const value = useMemo(() => ({
    // Auth State
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    isAdminAuthenticated, 
    isWalletAdmin,

    // Actions
    login,
    register,
    logout,
    adminLogin,

    // Wallet State
    isConnected,
    walletAddress: address,
    currentWalletAddress,
    signatureVerified,
    verifySignature,

    // Blockchain State
    selectedBlockchain,
    setSelectedBlockchain,
    getSelectedBlockchain
  }), [
    currentUser, loading,
    isAdminAuthenticated, isWalletAdmin,
    login, register, logout, adminLogin,
    isConnected, address, currentWalletAddress,
    signatureVerified, verifySignature,
    selectedBlockchain, setSelectedBlockchain, getSelectedBlockchain
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};