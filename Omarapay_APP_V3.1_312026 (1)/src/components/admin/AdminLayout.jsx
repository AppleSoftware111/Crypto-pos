import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { adminMenuStructure } from '@/config/adminConfig';
import AdminHeader from './AdminHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAdmin } from '@/context/AdminContext';
import { ChevronRight } from 'lucide-react';

const SidebarContent = ({ onClose }) => {
    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                 <img 
                    src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                    alt="Omara Logo" 
                    className="h-8 w-8"
                 />
                 <div>
                    <h1 className="text-xl font-bold tracking-wider text-white">OMARA<span className="text-blue-400">ADMIN</span></h1>
                    <p className="text-xs text-slate-400 mt-1">Super Admin Console</p>
                 </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                {adminMenuStructure.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose} 
                                        className={({ isActive }) => `
                                            group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                                            ${isActive 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Icon className="mr-3 h-5 w-5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                                        {item.name}
                                        <ChevronRight className={`ml-auto h-4 w-4 opacity-0 transition-all ${onClose ? '' : '-translate-x-2 group-hover:translate-x-0 group-hover:opacity-50'}`} />
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
            
            <div className="p-4 bg-slate-950 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold shadow-lg border border-white/10">
                         <img 
                            src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                            alt="Admin" 
                            className="h-5 w-5"
                         />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">Super Admin</p>
                        <p className="text-xs text-slate-400">Security Level: L1</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminLayout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 fixed inset-y-0 z-50 shadow-xl">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetContent side="left" className="p-0 w-72 border-r-0 bg-slate-900">
                    <SidebarContent onClose={() => setIsMobileOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Main Content Area */}
            <div className="lg:pl-72 flex flex-col flex-1 w-full transition-all duration-300">
                <AdminHeader onMenuClick={() => setIsMobileOpen(true)} />
                <main className="flex-1 p-6 overflow-x-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;