import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    CreditCard, 
    Banknote, 
    BarChart3, 
    Users, 
    FileText, 
    Package, 
    PieChart, 
    Settings,
    LogOut,
    Menu,
    X,
    Wallet,
    Fingerprint,
    Receipt,
    Coins
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBusiness } from '@/context/BusinessContext';
import { useAuth } from '@/context/AuthContext';
import { POS_ENABLED } from '@/config/posConfig';

const MerchantSidebar = ({ mobileOpen, setMobileOpen }) => {
    const { businessProfile, navigateToPersonalDashboard } = useBusiness();
    const { walletAddress } = useAuth();
    
    const posItems = POS_ENABLED
        ? [
            { name: 'Accept Payments (POS)', path: '/merchant/pos', icon: Receipt, tourId: 'nav-pos' },
            { name: 'POS Settings', path: '/merchant/pos-settings', icon: Coins, tourId: 'nav-pos-settings' },
          ]
        : [];
    const menuItems = [
        { name: 'Dashboard', path: '/merchant/dashboard', icon: LayoutDashboard, tourId: 'nav-dashboard' },
        ...posItems,
        { name: 'Transactions', path: '/merchant/transactions', icon: CreditCard, tourId: 'nav-transactions' },
        { name: 'Payouts', path: '/merchant/payouts', icon: Banknote, tourId: 'nav-payouts' },
        { name: 'Reports', path: '/merchant/reports', icon: BarChart3, tourId: 'nav-reports' },
        { name: 'Customers', path: '/merchant/customers', icon: Users, tourId: 'nav-customers' },
        { name: 'Invoices', path: '/merchant/invoices', icon: FileText, tourId: 'nav-invoices' },
        { name: 'Products', path: '/merchant/products', icon: Package, tourId: 'nav-products' },
        { name: 'Analytics', path: '/merchant/analytics', icon: PieChart, tourId: 'nav-analytics' },
        { name: 'Settings', path: '/merchant/settings', icon: Settings, tourId: 'nav-settings' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary text-xl">
                            {businessProfile?.businessName?.charAt(0) || 'M'}
                        </span>
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-sm truncate">{businessProfile?.businessName || 'Merchant'}</h2>
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block">
                            Active
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        data-tour={item.tourId}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            isActive 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                 <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> Wallet</span>
                        <span className="font-mono">{walletAddress?.substring(0,6)}...</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Fingerprint className="w-3 h-3" /> MID</span>
                        <span className="font-mono">{businessProfile?.merchantId?.substring(0,8)}</span>
                    </div>
                 </div>
                 
                 <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                    onClick={() => navigateToPersonalDashboard()}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Exit to Personal
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </div>
        </>
    );
};

export default MerchantSidebar;