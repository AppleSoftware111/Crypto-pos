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
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogleToken,
  logoutSession,
  bootstrapAuthSession,
} from "@/lib/authApi";
import {
  loginCryptoPOSAdmin,
  getCryptoPOSAdminAuthStatus,
  logoutCryptoPOSAdmin,
  setPOSAdminSessionFlag,
} from "@/lib/posAdminApi";

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
  const [sessionUser, setSessionUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [signatureVerified, setSignatureVerified] = useState(false);
  const [selectedBlockchain, setSelectedBlockchainState] = useState(null);
  const [currentWalletAddress, setCurrentWalletAddress] = useState(null);

  const { toast } = useToast();

  // Initialize: Omara user session (/me), else Crypto POS admin session (/api/admin/auth/status)
  useEffect(() => {
    let cancelled = false;
    const initAuth = async () => {
      try {
        const { user } = await bootstrapAuthSession();
        if (!cancelled) setSessionUser(user);
        if (!user && !cancelled) {
          try {
            const st = await getCryptoPOSAdminAuthStatus();
            if (st?.authenticated && st.admin) {
              setSessionUser({
                id: String(st.admin.id),
                email: `${st.admin.username}@pos.local`,
                role: "admin",
                name: st.admin.username,
                provider: "pos-admin",
              });
              setIsAdminAuthenticated(true);
              setPOSAdminSessionFlag(true);
            }
          } catch {
            // no Crypto POS admin cookie
          }
        }
      } catch {
        if (!cancelled) setSessionUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    initAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  // Build the effective user model from wallet and backend session
  useEffect(() => {
    if (address) {
      const walletUser = {
        id: userIdManager.getExistingUserId() || 'wallet-user',
        wallet_address: address,
        role: isAdminWallet(address) ? 'admin' : 'user',
        authMethod: 'wallet',
        email: sessionUser?.email || null,
        name: sessionUser?.name || 'Wallet User',
      };
      setCurrentUser(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(walletUser)) return walletUser;
        return prev;
      });
      setIsWalletAdmin(isAdminWallet(address));
      setCurrentWalletAddress(address);
      return;
    }

    if (sessionUser) {
      const mappedUser = {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name || sessionUser.email?.split('@')[0] || 'User',
        role: sessionUser.role || 'user',
        authMethod:
          sessionUser.provider === 'pos-admin'
            ? 'pos-admin'
            : String(sessionUser.provider || 'email').includes('google')
              ? 'google'
              : 'email',
      };
      setCurrentUser(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(mappedUser)) return mappedUser;
        return prev;
      });
      setIsWalletAdmin(false);
      setCurrentWalletAddress(null);
      return;
    }

    setCurrentUser(null);
    setIsWalletAdmin(false);
    setCurrentWalletAddress(null);
  }, [address, sessionUser]);

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

  const login = useCallback(async (email, password) => {
      setLoading(true);
      try {
        const result = await loginWithEmail({ email: email.trim(), password });
        setSessionUser(result?.user || null);
        return result;
      } finally {
        setLoading(false);
      }
  }, []);

  const register = useCallback(async (email, password, metadata) => {
      setLoading(true);
      try {
        const result = await registerWithEmail({
            email: email.trim(),
            password,
            name: metadata?.name || email.split('@')[0],
        });
        setSessionUser(result?.user || null);
        return result;
      } finally {
        setLoading(false);
      }
  }, []);

  const loginWithGoogle = useCallback(async (credentialResponse) => {
      if (!credentialResponse?.credential) return false;
      const result = await loginWithGoogleToken(credentialResponse.credential);
      setSessionUser(result?.user || null);
      return true;
  }, []);

  const adminLogin = useCallback(
    async (emailOrUsername, password) => {
      const raw = String(emailOrUsername || "").trim();
      const username = raw.includes("@") ? raw.split("@")[0].trim() : raw;
      if (!username || !password) {
        toast({
          title: "Missing credentials",
          description: "Enter username (or email) and password.",
          variant: "destructive",
        });
        return false;
      }
      try {
        const data = await loginCryptoPOSAdmin(username, password);
        if (data?.success && data?.admin) {
          setSessionUser({
            id: String(data.admin.id),
            email: `${data.admin.username}@pos.local`,
            role: "admin",
            name: data.admin.username,
            provider: "pos-admin",
          });
          setIsAdminAuthenticated(true);
          setPOSAdminSessionFlag(true);
          toast({ title: "Signed in", description: "Crypto POS admin session active." });
          return true;
        }
      } catch (err) {
        const msg =
          err?.response?.data?.error || err.message || "Invalid credentials";
        toast({ title: msg, variant: "destructive" });
      }
      return false;
    },
    [toast]
  );

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } catch {
      // no-op
    }
    try {
      await logoutCryptoPOSAdmin();
    } catch {
      // no-op
    }
    setPOSAdminSessionFlag(false);
    if (isConnected) disconnect();

    setSignatureVerified(false);
    setCurrentWalletAddress(null);
    setIsWalletAdmin(false);
    setCurrentUser(null);
    setSessionUser(null);
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
    loginWithGoogle,
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
    login, register, logout, loginWithGoogle, adminLogin,
    isConnected, address, currentWalletAddress,
    signatureVerified, verifySignature,
    selectedBlockchain, setSelectedBlockchain, getSelectedBlockchain
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};