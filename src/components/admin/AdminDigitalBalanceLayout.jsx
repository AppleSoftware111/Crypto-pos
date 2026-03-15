import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Wallet, ShieldAlert, BarChart3, Banknote, Globe, Coins } from 'lucide-react';

const navItems = [
    { name: 'Balance Control', icon: LayoutDashboard, path: '/admin/balance-control' },
    { name: 'Deposits', icon: Banknote, path: '/admin/deposits' },
    { name: 'Withdrawals', icon: ArrowLeftRight, path: '/admin/withdrawals' },
    { name: 'Remittance', icon: Globe, path: '/admin/remittance' },
    { name: 'Liquidity & Treasury', icon: Coins, path: '/admin/currency-liquidity' },
    { name: 'Compliance & Risk', icon: ShieldAlert, path: '/admin/compliance' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
];

const AdminDigitalBalanceLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <aside className="w-64 bg-white dark:bg-gray-800 border-r flex flex-col hidden md:flex">
            <div className="p-6 border-b">
                <h2 className="text-lg font-bold text-primary">Admin Finance</h2>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
        <main className="flex-1 overflow-auto p-8">
            <Outlet />
        </main>
    </div>
  );
};

export default AdminDigitalBalanceLayout;