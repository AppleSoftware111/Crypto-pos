import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, ShieldCheck } from 'lucide-react';

const UserPrivateRoute = ({ children, role, requireChainSelection = true }) => {
  const { isConnected, loading, currentUser, impersonatingFrom, signatureVerified, selectedBlockchain } = useAuth();
  const location = useLocation();
  
  // Terms of Use Modal State
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged terms
    const hasAcknowledged = localStorage.getItem('termsAcknowledged');
    if (hasAcknowledged) {
        setTermsAccepted(true);
    } else {
        // Only show if user is authenticated and actually trying to access the app
        if ((isConnected || currentUser) && !loading) {
            setShowTerms(true);
        }
    }
  }, [isConnected, currentUser, loading]);

  const handleAcceptTerms = () => {
      localStorage.setItem('termsAcknowledged', 'true');
      setTermsAccepted(true);
      setShowTerms(false);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><div>Loading...</div></div>;
  }

  // Basic auth check
  const isAuthenticated = isConnected || currentUser || impersonatingFrom;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Web3 Specific Checks
  if (currentUser?.authMethod === 'web3' && !impersonatingFrom) {
      // 1. Check Signature
      if (!signatureVerified && location.pathname !== '/login') {
         return <Navigate to="/login" replace />;
      }
      
      // 2. Check Chain Selection
      if (requireChainSelection && !selectedBlockchain && location.pathname !== '/chain-selection') {
          return <Navigate to="/chain-selection" replace />;
      }
  }
  
  // If a specific role is required (e.g., 'Merchant' or 'User')
  if (role && currentUser?.role !== role) {
    if (currentUser?.role === 'Merchant') {
      return <Navigate to="/dashboard" replace />;
    }
    if (currentUser?.role === 'User') {
      return <Navigate to="/wallet" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Blocking Modal for Terms of Use
  if (showTerms && !termsAccepted) {
      return (
        <Dialog open={true} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[600px] pointer-events-auto" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <ShieldCheck className="text-primary h-6 w-6" />
                        Terms of Service Update
                    </DialogTitle>
                    <DialogDescription>
                        Please review and accept our Terms of Use to continue accessing the Omara Payments platform.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-sm leading-relaxed">
                    <p className="mb-3 font-semibold text-amber-600 dark:text-amber-500">
                        Important Regulatory Notice:
                    </p>
                    <p className="mb-3 text-muted-foreground">
                        Omara Payment Services Corp. is registered with the SEC (Reg. No. 2023110126009-01). 
                        However, we do not currently hold a secondary license from the BSP for VASP or EMI operations. 
                        By proceeding, you acknowledge that you understand the scope of our services.
                    </p>
                    <p className="text-muted-foreground">
                        You agree to the full Terms of Use located at our official website. 
                        Your continued use of this application constitutes acceptance of these terms.
                    </p>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.open('https://www.omarapay.com/terms-of-use', '_blank')}>
                        Read Full Terms <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                    <Button className="w-full sm:w-auto" onClick={handleAcceptTerms}>
                        I Acknowledge & Accept
                    </Button>
                </DialogFooter>
            </DialogContent>
            {/* Render children in background but blurred/hidden if strictly needed, or just return null to be safe */}
            <div className="filter blur-sm opacity-50 pointer-events-none h-screen overflow-hidden">
                {children}
            </div>
        </Dialog>
      );
  }

  return children;
};

export default UserPrivateRoute;