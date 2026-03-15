import React from 'react';
import { useUsers } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import BalanceDisplayCard from '@/components/wallet/BalanceDisplayCard';
import TransactionHistoryComponent from '@/components/wallet/TransactionHistoryComponent';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, Plus, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const DigitalBalanceWalletPage = () => {
  const { digitalBalances, loading } = useUsers();
  const { currentUser } = useAuth();

  if (loading) return <div className="p-8">Loading wallet...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Digital Wallet</h1>
                <p className="text-muted-foreground">Welcome back, {currentUser?.name || 'User'}</p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4">
            <Link to="/wallet/deposit">
                <Button className="w-full h-auto py-4 flex-col gap-2" variant="outline">
                    <div className="bg-green-100 p-2 rounded-full text-green-600"><Plus className="w-6 h-6" /></div>
                    Deposit
                </Button>
            </Link>
            <Link to="/wallet/withdraw">
                <Button className="w-full h-auto py-4 flex-col gap-2" variant="outline">
                    <div className="bg-red-100 p-2 rounded-full text-red-600"><ArrowUpRight className="w-6 h-6" /></div>
                    Withdraw
                </Button>
            </Link>
            <Link to="/wallet/send">
                 <Button className="w-full h-auto py-4 flex-col gap-2" variant="outline">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Send className="w-6 h-6" /></div>
                    Send
                </Button>
            </Link>
            <Link to="/wallet/receive">
                 <Button className="w-full h-auto py-4 flex-col gap-2" variant="outline">
                    <div className="bg-purple-100 p-2 rounded-full text-purple-600"><ArrowDownLeft className="w-6 h-6" /></div>
                    Receive
                </Button>
            </Link>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BalanceDisplayCard 
                currency="USD" 
                amount={digitalBalances.USD || 0} 
                colorFrom="from-blue-600" 
                colorTo="to-blue-400" 
            />
            <BalanceDisplayCard 
                currency="PHP" 
                amount={digitalBalances.PHP || 0} 
                colorFrom="from-yellow-500" 
                colorTo="to-orange-500" 
            />
            <BalanceDisplayCard 
                currency="EUR" 
                amount={digitalBalances.EUR || 0} 
                colorFrom="from-indigo-600" 
                colorTo="to-purple-500" 
            />
        </div>

        {/* Transactions */}
        <TransactionHistoryComponent userEmailOnly={true} userEmail={currentUser?.email} />
      </div>
    </div>
  );
};

export default DigitalBalanceWalletPage;