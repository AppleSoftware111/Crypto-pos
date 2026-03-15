import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  LayoutDashboard, BarChart2, Users, Settings, LifeBuoy, LogOut, HardDrive, User, Landmark, Receipt,
  History, Contact, AreaChart, CreditCard, Link as LinkIcon, Shield, FileText, Wrench, ChevronRight,
  ShoppingBag, DollarSign, Target, HelpCircle, FileLock, Lock, EyeOff, Wallet
} from 'lucide-react';

const menuItems = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
        isAccordion: false,
    },
    {
        name: 'Financials',
        icon: DollarSign,
        isAccordion: true,
        subItems: [
            { name: 'Transaction History', icon: History, path: '/dashboard/transactions' },
        ],
    },
    {
        name: 'Account',
        icon: User,
        isAccordion: true,
        subItems: [
            { name: 'Profile Management', icon: User, path: '/dashboard/profile' },
        ],
    },
    {
        name: 'Security',
        icon: Lock,
        isAccordion: true,
        subItems: [
            { name: 'Security & Privacy', icon: Shield, path: '/dashboard/security' },
        ]
    }
];

const NavItem = ({ item }) => {
    const location = useLocation();
    const isActive = item.path && location.pathname === item.path;

    return (
        <li>
            <NavLink
                to={item.path}
                end
                className={({ isActive: navIsActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-colors text-sm font-medium ${
                        navIsActive || isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`
                }
            >
                <item.icon size={20} />
                <span>{item.name}</span>
            </NavLink>
        </li>
    );
};

const SubNavItem = ({ item }) => {
    return (
         <li className="pl-4">
            <NavLink
                to={item.path}
                className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm font-medium ${
                        isActive
                            ? 'bg-primary/10 text-primary dark:bg-primary/20'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`
                }
            >
                <ChevronRight size={16} />
                <span>{item.name}</span>
            </NavLink>
        </li>
    );
};

const UserDashboardLayout = ({ children }) => {
    const { userLogout, currentUser, walletAddress, isConnected } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    
    const [openAccordion, setOpenAccordion] = useState('');

    useEffect(() => {
        const currentMenu = menuItems.find(menu => 
            menu.isAccordion && menu.subItems?.some(sub => sub.path === location.pathname)
        );
        if (currentMenu) {
            setOpenAccordion(currentMenu.name);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (!isConnected) {
            navigate('/login');
        }
    }, [isConnected, navigate]);

    const handleLogout = () => {
        if (userLogout) userLogout();
        navigate('/login');
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex-col hidden lg:flex">
                    <div className="p-6 text-center border-b border-gray-100 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gradient mb-1">Personal Account</h1>
                        {walletAddress && (
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-gray-100 dark:bg-gray-900 py-1 px-2 rounded-full mx-auto w-fit">
                                <Wallet size={10} />
                                <span className="font-mono">{walletAddress.substring(0,6)}...</span>
                            </div>
                        )}
                    </div>
                    <nav className="flex-grow px-2 overflow-y-auto pb-4 pt-4">
                        <ul className="space-y-1">
                            {menuItems.map((item) => (
                                item.isAccordion ? (
                                    <Accordion key={item.name} type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion}>
                                        <AccordionItem value={item.name} className="border-b-0">
                                            <AccordionTrigger className="flex items-center space-x-3 p-3 rounded-lg transition-colors text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:no-underline [&[data-state=open]]:bg-gray-200 dark:[&[data-state=open]]:bg-gray-700">
                                                <div className="flex items-center space-x-3">
                                                    <item.icon size={20} />
                                                    <span>{item.name}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ul className="space-y-1 pt-1">
                                                    {item.subItems?.map(subItem => <SubNavItem key={subItem.name} item={subItem} />)}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ) : (
                                    <NavItem key={item.name} item={item} />
                                )
                            ))}
                        </ul>
                    </nav>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50">
                            <LogOut size={20} className="mr-3" />
                            Disconnect
                        </Button>
                    </div>
                </aside>
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pt-20 lg:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default UserDashboardLayout;