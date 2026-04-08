import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBusiness } from '@/context/BusinessContext';
import { useMerchant } from '@/context/MerchantContext';
import { REGISTRATION_STATUS } from '@/lib/businessSchema';
import { Button } from '@/components/ui/button';
import { Menu, Bell, User, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import MerchantSidebar from './MerchantSidebar';
import ModeToggle from './ModeToggle';
import ModeBanner from './ModeBanner';
import PosSessionBanner from './PosSessionBanner';
import ConnectPosModal from './ConnectPosModal';
import DemoWalkthrough from '@/components/demo/DemoWalkthrough';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MerchantLayout = () => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { 
        selectedAccountType, 
        businessProfile, 
        loading: businessLoading,
    } = useBusiness();
    const { isModeDemo, isModeLive, needsPosSessionBanner, refreshData } = useMerchant();
    
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [connectPosOpen, setConnectPosOpen] = useState(false);

    const kioskOnPos =
        location.pathname === '/merchant/pos' && searchParams.get('kiosk') === '1';
    const isCashierTerminal =
        location.pathname === '/merchant/cashier' || kioskOnPos;
    
    // Walkthrough State
    const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);

    useEffect(() => {
        if (!authLoading && !businessLoading) {
            if (!isAuthenticated) {
                navigate('/login');
            } else if (selectedAccountType !== 'business' || !businessProfile) {
                if (!location.pathname.includes('/business/register')) {
                     navigate('/wallet'); 
                }
            }
        }
    }, [isAuthenticated, authLoading, businessLoading, selectedAccountType, businessProfile, navigate, location]);

    // Auto-start walkthrough on first visit to Demo Mode
    useEffect(() => {
        if (!businessLoading && isModeDemo()) {
            const hasCompleted = localStorage.getItem('omara_demo_walkthrough_completed');
            if (!hasCompleted && location.pathname.includes('dashboard')) {
                // Short delay to allow render
                setTimeout(() => setIsWalkthroughActive(true), 1000);
            }
        }
    }, [isModeDemo, businessLoading, location.pathname]);

    const handleStartWalkthrough = () => {
        setIsWalkthroughActive(true);
        // If not on dashboard, navigate there first
        if (!location.pathname.includes('dashboard')) {
            navigate('/merchant/dashboard');
        }
    };

    const handleWalkthroughComplete = () => {
        setIsWalkthroughActive(false);
        localStorage.setItem('omara_demo_walkthrough_completed', 'true');
    };

    if (authLoading || businessLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Merchant Portal...</div>;
    }

    if (!businessProfile && location.pathname !== '/business/register') return null;

    // Only approved (ACTIVE) merchants can access dashboard and POS
    if (businessProfile.status !== REGISTRATION_STATUS.ACTIVE) {
        const statusLabel = (businessProfile.status || '').replace(/_/g, ' ');
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-4">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Pending admin approval</h1>
                    <p className="text-muted-foreground">
                        Your business <strong>{businessProfile.businessName}</strong> is under review. You will get access to the merchant dashboard and POS once an admin approves your registration.
                    </p>
                    {businessProfile.status && (
                        <p className="text-sm text-muted-foreground">Status: {statusLabel}</p>
                    )}
                    {businessProfile.status === REGISTRATION_STATUS.REJECTED && businessProfile.rejectionReason && (
                        <p className="text-sm text-amber-700 dark:text-amber-400">{businessProfile.rejectionReason}</p>
                    )}
                    {businessProfile.status === REGISTRATION_STATUS.REJECTED && (
                        <p className="text-sm text-muted-foreground">Contact support if you have questions.</p>
                    )}
                    <Button onClick={() => navigate('/wallet')} className="mt-4">
                        Back to Wallet
                    </Button>
                </div>
            </div>
        );
    }

    if (isCashierTerminal) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-white dark:bg-gray-900 px-4 shadow-sm">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/merchant/dashboard')}>
                        Merchant dashboard
                    </Button>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <span className="text-xs text-muted-foreground hidden sm:inline">Staff / cashier</span>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <MerchantSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Top Navbar */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-gray-900 px-6 shadow-sm">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    
                    <div className="flex flex-1 items-center justify-between">
                         <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hidden md:block">
                            {location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1)}
                         </h1>
                         
                         <div className="flex items-center gap-4 ml-auto">
                            <ModeToggle />
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                            
                            {/* Help Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-500">
                                        <HelpCircle className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleStartWalkthrough}>
                                        Restart Demo Walkthrough
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.open('https://help.omara.com', '_blank')}>
                                        Help Center
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button variant="ghost" size="icon" className="text-gray-500">
                                <Bell className="h-5 w-5" />
                            </Button>
                            
                            <div className="flex items-center gap-3 pl-4 border-l">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium">{businessProfile?.ownerFirstName}</p>
                                    <p className="text-xs text-muted-foreground">Merchant Owner</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    <User className="h-4 w-4" />
                                </div>
                            </div>
                         </div>
                    </div>
                </header>

                {/* Mode Banner with Walkthrough Trigger */}
                <ModeBanner onStartWalkthrough={handleStartWalkthrough} />

                {isModeLive() && needsPosSessionBanner && (
                    <PosSessionBanner
                        onConnect={() => setConnectPosOpen(true)}
                    />
                )}

                <ConnectPosModal
                    open={connectPosOpen}
                    onOpenChange={setConnectPosOpen}
                    onConnected={() => refreshData()}
                />

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>

            {/* Walkthrough Component */}
            <DemoWalkthrough 
                isActive={isWalkthroughActive} 
                onComplete={handleWalkthroughComplete}
                onSkip={() => setIsWalkthroughActive(false)}
            />
        </div>
    );
};

export default MerchantLayout;