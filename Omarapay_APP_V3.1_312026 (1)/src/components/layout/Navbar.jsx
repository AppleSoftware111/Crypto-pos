import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, Building2, User, ChevronDown, PlusCircle, Check, LogOut, Wallet, Copy, Fingerprint, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useBusiness } from '@/context/BusinessContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navLoading, setNavLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { isConnected, walletAddress } = useAuth();
  const { 
    selectedAccountType, 
    userBusinesses, 
    businessProfile,
    userUUID,
    navigateToPersonalDashboard,
    navigateToMerchantDashboard
  } = useBusiness();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const copyToClipboard = (text, label) => {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  const handlePersonalSwitch = async () => {
      setNavLoading(true);
      await navigateToPersonalDashboard(navigate);
      setNavLoading(false);
  };

  const handleMerchantSwitch = async (mid) => {
      setNavLoading(true);
      await navigateToMerchantDashboard(navigate, mid);
      setNavLoading(false);
  };

  const navLinks = useMemo(() => selectedAccountType === 'business' 
    ? [
        { name: 'Dashboard', path: '/merchant/dashboard' },
        { name: 'Documents', path: '/merchant/documents' },
        { name: 'Transactions', path: '/merchant/transactions' }
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Omara AI', path: '/ai-assistant', icon: <Sparkles size={14} className="mr-1 text-indigo-500" /> },
        { name: 'Business Locator', path: '/business-locator' },
        { name: 'Contact', path: '/contact' }
    ], [selectedAccountType]);

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5')}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
             <img src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/omara_business_solutions_logo-QYFaa.png" alt="Omara" className="h-8 w-auto md:h-10 group-hover:scale-105 transition-transform" />
             <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Omara</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={cn('text-sm font-medium transition-colors hover:text-primary flex items-center', location.pathname === link.path ? 'text-primary' : 'text-gray-700 dark:text-gray-200')}>
                {link.icon && link.icon}
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-4 border-l pl-4 border-gray-200 dark:border-gray-700">
               {/* Account Switcher with UUID/Wallet Info */}
               {isConnected && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="outline" className="flex items-center gap-2 h-9 px-3 border-dashed border-gray-300 hover:border-primary relative" disabled={navLoading}>
                          {navLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (selectedAccountType === 'personal' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />)}
                          
                          <span className="text-sm font-medium max-w-[100px] truncate">
                             {selectedAccountType === 'personal' ? 'Personal' : businessProfile?.businessName || 'Business'}
                          </span>
                          
                          {/* Active Indicator Badge */}
                          <Badge variant="secondary" className="h-1.5 w-1.5 p-0 rounded-full bg-green-500 absolute top-1 right-1" />
                          
                          <ChevronDown className="w-3 h-3 opacity-50" />
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                       <DropdownMenuLabel className="pb-0">Account Context</DropdownMenuLabel>
                       
                       {/* Context Info Box */}
                       <div className="m-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md border text-xs space-y-1">
                           <div className="flex justify-between items-center">
                               <span className="text-muted-foreground flex items-center gap-1"><Fingerprint className="w-3 h-3" /> UUID</span>
                               <div className="flex items-center gap-1 font-mono">
                                   {userUUID?.substring(0,8)}...
                                   <Copy className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => copyToClipboard(userUUID, "UUID")} />
                               </div>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-muted-foreground flex items-center gap-1"><Wallet className="w-3 h-3" /> Wallet</span>
                               <div className="flex items-center gap-1 font-mono">
                                   {walletAddress?.substring(0,6)}...{walletAddress?.substring(walletAddress.length-4)}
                                   <Copy className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => copyToClipboard(walletAddress, "Address")} />
                               </div>
                           </div>
                       </div>
                       
                       <DropdownMenuSeparator />
                       
                       <DropdownMenuItem onClick={handlePersonalSwitch} className="cursor-pointer">
                          <div className="flex items-center justify-between w-full">
                             <div className="flex items-center gap-2">
                                <div className="p-1 bg-gray-100 rounded-md"><User className="w-4 h-4 text-gray-600" /></div>
                                <div className="flex flex-col">
                                   <span className="font-medium">Personal Account</span>
                                </div>
                             </div>
                             {selectedAccountType === 'personal' && <Check className="w-4 h-4 text-primary" />}
                          </div>
                       </DropdownMenuItem>
                       
                       <DropdownMenuSeparator />
                       <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Bound Merchants</DropdownMenuLabel>
                       
                       <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
                           {userBusinesses.map(bus => (
                              <DropdownMenuItem key={bus.merchantId} onClick={() => handleMerchantSwitch(bus.merchantId)} className="cursor-pointer">
                                 <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                       <div className="p-1 bg-indigo-50 rounded-md"><Building2 className="w-4 h-4 text-indigo-600" /></div>
                                       <div className="flex flex-col">
                                          <span className="font-medium truncate max-w-[140px]">{bus.businessName}</span>
                                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                             <Wallet className="w-2 h-2" /> {bus.walletAddress?.substring(0,4)}...
                                          </span>
                                       </div>
                                    </div>
                                    {selectedAccountType === 'business' && businessProfile?.merchantId === bus.merchantId && <Check className="w-4 h-4 text-primary" />}
                                 </div>
                              </DropdownMenuItem>
                           ))}
                           {userBusinesses.length === 0 && (
                               <div className="px-2 py-2 text-xs text-center text-muted-foreground italic">No merchants bound to this wallet.</div>
                           )}
                       </DropdownMenuGroup>

                       <DropdownMenuSeparator />
                       <DropdownMenuItem onClick={() => navigate('/business/register')} className="cursor-pointer">
                          <div className="flex items-center gap-2 text-primary w-full justify-center py-1 font-medium">
                             <PlusCircle className="w-4 h-4" />
                             <span>Register New Business</span>
                          </div>
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
               )}

               {!isConnected && (
                    <Link to="/login"><Button variant="outline" size="sm">Connect Wallet</Button></Link>
               )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden bg-white dark:bg-gray-900 border-t overflow-hidden">
                <div className="p-4 space-y-4">
                     {navLinks.map(link => <Link key={link.path} to={link.path} className="block py-2" onClick={() => setIsOpen(false)}>{link.name}</Link>)}
                     <div className="pt-4 border-t">
                         {isConnected ? (
                             <div className="space-y-2">
                                 <div className="text-xs text-muted-foreground">Logged in as {walletAddress?.substring(0,6)}...</div>
                                 <Button variant="outline" className="w-full justify-start" onClick={handlePersonalSwitch} disabled={navLoading}>
                                     {navLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <User className="w-4 h-4 mr-2" />}
                                     Switch to Personal
                                 </Button>
                                 <Button className="w-full" onClick={() => navigate('/business/register')}>Register Business</Button>
                             </div>
                         ) : (
                             <Button className="w-full" onClick={() => navigate('/login')}>Connect Wallet</Button>
                         )}
                     </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;