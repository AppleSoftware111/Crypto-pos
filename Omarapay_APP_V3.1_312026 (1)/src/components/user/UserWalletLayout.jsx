import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Send, 
  ArrowDownLeft, 
  Plus, 
  LogOut, 
  EyeOff, 
  Menu,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  FileText,
  Briefcase
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import BlockchainSwitcher from "@/components/wallet/BlockchainSwitcher";

const ImpersonationBanner = () => {
  const { currentUser, stopImpersonating, impersonatingFrom } = useAuth();
  if (!impersonatingFrom) return null;
  return (
    <Alert className="rounded-none border-l-0 border-r-0 border-t-0 border-b-4 border-yellow-500 bg-yellow-50 text-yellow-800">
      <AlertTitle className="font-bold">Admin Impersonation Active</AlertTitle>
      <div className="flex justify-between items-center gap-3">
        <AlertDescription>
          Viewing as <strong>{currentUser?.name || "User"}</strong>
        </AlertDescription>
        <Button size="sm" variant="outline" onClick={stopImpersonating}>
          <EyeOff className="mr-2 h-4 w-4" /> Return to Admin
        </Button>
      </div>
    </Alert>
  );
};

const UserWalletLayout = () => {
  const { logout, impersonatingFrom } = useAuth();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/wallet" },
    { name: "Register Business", icon: Briefcase, path: "/business/register" },
    { name: "Deposit", icon: Plus, path: "/wallet/deposit" },
    { name: "Withdraw", icon: ArrowUpRight, path: "/wallet/withdraw" },
    { name: "Send", icon: Send, path: "/wallet/send" },
    { name: "Receive", icon: ArrowDownLeft, path: "/wallet/receive" },
  ];

  const SidebarContent = ({ isMobile }) => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <img 
            src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
            alt="Omara Logo" 
            className="h-8 w-8"
        />
        <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none">
            Omara
            </h1>
            <span className="text-xs text-gray-500 font-medium">Wallet Dashboard</span>
        </div>
      </div>

      <div className="px-6 mb-4 mt-6">
         <BlockchainSwitcher />
      </div>

      <nav className="flex-grow px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/wallet"}
            onClick={() => isMobile && setIsSheetOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md translate-x-1"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <item.icon size={20} strokeWidth={2} />
            <span>{item.name}</span>
          </NavLink>
        ))}

        <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
           <p className="px-4 text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Features</p>
           <NavLink
              to="/merchant/ai-assistant"
              onClick={() => isMobile && setIsSheetOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm group ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50"
                    : "text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
                }`
              }
            >
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                 <Sparkles size={16} />
              </div>
              <span>Omara AI</span>
           </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto bg-gray-50 dark:bg-gray-900/50">
        {!impersonatingFrom && (
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 mb-4"
          >
            <LogOut size={18} className="mr-3" /> Logout
          </Button>
        )}
        
        {/* Mobile-Only Legal Footer in Drawer */}
        {isMobile && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2 text-xs text-gray-500">
                <a href="https://www.omarapay.com/privacy-policy" target="_blank" rel="noreferrer" className="block hover:text-primary flex items-center gap-2"><ShieldCheck size={12}/> Privacy Policy</a>
                <a href="https://www.omarapay.com/terms-of-use" target="_blank" rel="noreferrer" className="block hover:text-primary flex items-center gap-2"><FileText size={12}/> Terms of Use</a>
                <p className="mt-2 text-[10px] opacity-70">SEC Reg. No. 2023110126009-01</p>
            </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <ImpersonationBanner />

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
             <img 
                src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                alt="Omara Logo" 
                className="h-8 w-8"
             />
             <span className="font-bold text-lg text-gray-900 dark:text-white">Omara Wallet</span>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-72 bg-white dark:bg-gray-900 border-r hidden lg:flex flex-col shadow-sm z-10">
          <SidebarContent isMobile={false} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative scroll-touch">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserWalletLayout;