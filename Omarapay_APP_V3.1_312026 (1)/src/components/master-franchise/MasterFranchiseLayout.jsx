import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LayoutDashboard, UserCircle, Briefcase, Package, DollarSign, Gem, HeartHandshake as Handshake, LifeBuoy, FileText, ShieldCheck, ChevronDown, ChevronRight, LogOut, EyeOff } from 'lucide-react';

const menuConfig = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/master-franchise' },
    { name: 'Profile Management', icon: UserCircle, path: '/master-franchise/profile' },
    { 
        name: 'Merchant Management', 
        icon: Briefcase, 
        subItems: [
            { name: 'Merchant Listing', path: '/master-franchise/merchants' },
            { name: 'Register New Merchant', path: '/master-franchise/merchants/register' }
        ] 
    },
    { 
        name: 'Product & Inventory', 
        icon: Package, 
        subItems: [
            { name: 'Product Ordering', path: '/master-franchise/products/order' },
            { name: 'Inventory Management', path: '/master-franchise/products/inventory' }
        ] 
    },
    { name: 'Financial Services', icon: DollarSign, path: '/master-franchise/financial-services' },
    { name: 'Financial Management', icon: DollarSign, path: '/master-franchise/financial-management' },
    { name: 'Merchant Subscription', icon: Gem, path: '/master-franchise/subscriptions' },
    { name: 'Affiliate Management', icon: Handshake, path: '/master-franchise/affiliates' },
    { name: 'Tech Support', icon: LifeBuoy, path: '/master-franchise/support' },
    { name: 'Document Management', icon: FileText, path: '/master-franchise/documents' },
    { name: 'Security & Privacy', icon: ShieldCheck, path: '/master-franchise/security' },
    { name: 'Compliance', icon: ShieldCheck, path: '/master-franchise/compliance' },
];

const ImpersonationBanner = () => {
  const { currentUser, stopImpersonating } = useAuth();
  if (!localStorage.getItem('omaraAdminImpersonatingFrom')) return null;

  return (
    <Alert className="rounded-none border-l-0 border-r-0 border-t-0 border-b-4 border-yellow-500 bg-yellow-50 text-yellow-800">
      <AlertTitle className="font-bold">Admin Impersonation Active</AlertTitle>
      <div className="flex justify-between items-center">
        <AlertDescription>
          You are currently viewing the dashboard as <strong>{currentUser?.name}</strong>.
        </AlertDescription>
        <Button size="sm" variant="outline" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-500" onClick={stopImpersonating}>
            <EyeOff className="mr-2 h-4 w-4" /> Return to Admin
        </Button>
      </div>
    </Alert>
  );
};


const SubMenu = ({ item, isOpen }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-4 space-y-1 overflow-hidden"
            >
                {item.subItems.map(subItem => (
                    <li key={subItem.name}>
                        <NavLink to={subItem.path} end className={({ isActive }) => `flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                             <span className="w-5 h-5 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                            </span>
                            <span>{subItem.name}</span>
                        </NavLink>
                    </li>
                ))}
            </motion.ul>
        )}
    </AnimatePresence>
);

const MasterFranchiseLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { masterFranchiseLogout, impersonatingFrom } = useAuth();
    const [openMenus, setOpenMenus] = useState(() => {
        const activeMenu = menuConfig.find(item => item.subItems?.some(sub => location.pathname.startsWith(sub.path)));
        return activeMenu ? { [activeMenu.name]: true } : {};
    });

    const toggleMenu = (name) => {
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleLogout = () => {
        masterFranchiseLogout();
        navigate('/master-franchise/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
             <ImpersonationBanner />
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-72 bg-white dark:bg-gray-800 shadow-md flex flex-col">
                    <div className="p-6 flex items-center gap-3 border-b dark:border-gray-700">
                        <img 
                            src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                            alt="Omara Logo" 
                            className="h-8 w-8"
                        />
                        <div>
                             <h1 className="text-sm font-bold text-gradient">OMARA PAYMENTS</h1>
                             <span className="text-xs text-gray-500">Master Franchise</span>
                        </div>
                    </div>
                    <nav className="flex-grow px-4 overflow-y-auto py-4">
                        <ul className="space-y-1">
                            {menuConfig.map((item) => (
                                <li key={item.name}>
                                    {item.subItems ? (
                                        <>
                                            <button onClick={() => toggleMenu(item.name)} className="w-full flex items-center justify-between space-x-3 p-3 rounded-lg transition-colors font-medium text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <div className="flex items-center space-x-3">
                                                    <item.icon size={20} />
                                                    <span>{item.name}</span>
                                                </div>
                                                {openMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            </button>
                                            <SubMenu item={item} isOpen={openMenus[item.name]} />
                                        </>
                                    ) : (
                                        <NavLink to={item.path} end className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors font-medium text-sm ${isActive ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                            <item.icon size={20} />
                                            <span>{item.name}</span>
                                        </NavLink>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                     {!impersonatingFrom && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-left">
                                <LogOut size={20} className="mr-3" />
                                Logout
                            </Button>
                        </div>
                    )}
                </aside>
                <main className="flex-1 p-8 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

export default MasterFranchiseLayout;