import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Copy, Check, Menu, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminHeader = ({ onMenuClick }) => {
  const { walletAddress, logout } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  // We use walletAddress from AuthContext as the primary ID
  const displayAddress = walletAddress || "Super Admin";

  const handleCopy = () => {
    if (walletAddress) {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        toast({ title: "Address Copied", description: "Admin wallet address copied to clipboard" });
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
         {onMenuClick && (
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                <Menu className="h-6 w-6" />
            </Button>
         )}
         <div className="flex items-center gap-3">
             <img 
                src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                alt="Omara Logo" 
                className="h-8 w-8 lg:hidden"
             />
            <h2 className="font-bold text-lg hidden sm:block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Super Admin Dashboard
            </h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 gap-1 flex items-center">
                <Shield className="w-3 h-3" /> 
                <span className="hidden xs:inline">Authenticated</span>
            </Badge>
         </div>
      </div>

      <div className="flex items-center gap-4">
        {walletAddress && (
            <div className="hidden md:flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-800 py-1.5 px-3 rounded-full border border-gray-100 dark:border-gray-700">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                    {displayAddress}
                </span>
                <button onClick={handleCopy} className="hover:text-primary transition-colors ml-1" title="Copy Address">
                    {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                </button>
            </div>
        )}

        <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20">
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;