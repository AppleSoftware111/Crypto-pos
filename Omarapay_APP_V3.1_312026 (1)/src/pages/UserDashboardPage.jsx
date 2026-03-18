import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/context/UserContext';
import { useBusiness } from '@/context/BusinessContext';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Building2, PlusCircle, ArrowRight, Fingerprint, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import WalletBalanceDisplay from '@/components/wallet/WalletBalanceDisplay';
import CurrencyConverter from '@/components/wallet/CurrencyConverter';
import DigitalBalanceWallet from '@/components/wallet/DigitalBalanceWallet';
import CryptoToDigitalBalanceConverter from '@/components/wallet/CryptoToDigitalBalanceConverter';
import TransactionHistoryFetcher from '@/components/wallet/TransactionHistoryFetcher';
import BlockchainSwitcher from '@/components/wallet/BlockchainSwitcher';
import DepositPage from '@/pages/wallet/DepositPage';
import WithdrawPage from '@/pages/wallet/WithdrawPage';
import SendMoneyPage from '@/pages/wallet/SendMoneyPage';
import ReceiveMoneyPage from '@/pages/wallet/ReceiveMoneyPage';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import { blockchainConfig } from '@/config/blockchainConfig';
import { useToast } from '@/components/ui/use-toast';

const UserDashboardPage = ({ defaultTab = 'overview' }) => {
  const { selectedBlockchainId, walletAddress } = useAuth();
  const { digitalBalances } = useUsers();
  const { userUUID, userBusinesses, navigateToMerchantDashboard } = useBusiness();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [switching, setSwitching] = useState(false);
  
  const currentChain = blockchainConfig[selectedBlockchainId] || Object.values(blockchainConfig)[0];
  const hasAnyBalance = digitalBalances && (digitalBalances.USD > 0 || digitalBalances.PHP > 0 || digitalBalances.EUR > 0);

  useEffect(() => {
     setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'overview') navigate('/wallet');
    else navigate(`/wallet/${value}`);
  };

  const copyToClipboard = (text, label) => {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  const handleSwitchToMerchant = async (merchantId) => {
      if (switching) return;
      setSwitching(true);
      await navigateToMerchantDashboard(navigate, merchantId);
      setSwitching(false);
  };

  return (
    <StandardPageWrapper 
      title="Wallet Dashboard" 
      subtitle="Personal Account > Wallet Dashboard"
      className="!pt-4"
    >
      <div className="flex justify-end mb-6 -mt-16 md:mt-0 relative z-10 pointer-events-none md:pointer-events-auto">
           <div className="pointer-events-auto shadow-sm rounded-lg">
              <BlockchainSwitcher />
           </div>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
             <CardContent className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-white dark:bg-slate-800 rounded-full border shadow-sm">
                         <Wallet className="w-5 h-5 text-blue-500" />
                     </div>
                     <div>
                         <p className="text-xs text-muted-foreground font-semibold uppercase">Connected Wallet</p>
                         <div className="flex items-center gap-2">
                             <code className="text-sm font-mono">{walletAddress?.substring(0,6)}...{walletAddress?.substring(walletAddress.length-4)}</code>
                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(walletAddress, "Address")}>
                                 <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                             </Button>
                         </div>
                     </div>
                 </div>
             </CardContent>
         </Card>
         <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
             <CardContent className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-white dark:bg-slate-800 rounded-full border shadow-sm">
                         <Fingerprint className="w-5 h-5 text-purple-500" />
                     </div>
                     <div>
                         <p className="text-xs text-muted-foreground font-semibold uppercase">User UUID</p>
                         <div className="flex items-center gap-2">
                             <code className="text-sm font-mono">{userUUID?.substring(0,8)}...</code>
                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(userUUID, "UUID")}>
                                 <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                             </Button>
                         </div>
                     </div>
                 </div>
             </CardContent>
         </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 h-auto rounded-xl inline-flex w-auto min-w-full md:min-w-0">
            {['overview', 'deposit', 'withdraw', 'send', 'receive'].map(tab => (
                <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="px-6 py-2.5 rounded-lg capitalize data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-sm md:text-base"
                    disabled={(tab === 'withdraw' || tab === 'send') && !hasAnyBalance}
                >
                    {tab} 
                    {(tab === 'withdraw' || tab === 'send') && !hasAnyBalance && <Lock className="ml-2 w-3 h-3 inline opacity-50" />}
                </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
           
           {/* My Merchant Accounts Section */}
           <div className="space-y-4">
               <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold flex items-center gap-2">
                       <Building2 className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                       My Merchant Accounts
                   </h2>
                   {userBusinesses.length > 0 && (
                       <Button size="sm" onClick={() => navigate('/business/register')}>
                           <PlusCircle className="w-4 h-4 mr-2" /> Register New Business
                       </Button>
                   )}
               </div>

               {userBusinesses.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {userBusinesses.map((merchant) => (
                           <Card key={merchant.merchantId} className="hover:shadow-md transition-shadow">
                               <CardContent className="p-5">
                                   <div className="flex justify-between items-start mb-4">
                                       <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                                           <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                       </div>
                                       <Badge variant={merchant.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                           {merchant.status}
                                       </Badge>
                                   </div>
                                   <h3 className="font-bold text-lg mb-1 truncate">{merchant.businessName}</h3>
                                   <p className="text-sm text-muted-foreground mb-4">{merchant.businessType}</p>
                                   <div className="flex gap-2">
                                       <Button 
                                            className="w-full" 
                                            onClick={() => handleSwitchToMerchant(merchant.merchantId)}
                                            disabled={switching}
                                       >
                                           Switch to Business
                                       </Button>
                                   </div>
                               </CardContent>
                           </Card>
                       ))}
                   </div>
               ) : (
                   <Card className="bg-gray-50 dark:bg-gray-900 border-dashed">
                       <CardContent className="py-8 text-center">
                           <Building2 className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Merchant Accounts</h3>
                           <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                               You haven't registered any businesses with this wallet yet. Start accepting crypto payments today.
                           </p>
                           <Button onClick={() => navigate('/business/register')}>
                               Register Your First Business
                           </Button>
                       </CardContent>
                   </Card>
               )}
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-8">
                  <DigitalBalanceWallet />
                  <TransactionHistoryFetcher selectedChain={currentChain} />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                  <WalletBalanceDisplay selectedChain={currentChain} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
                    <CurrencyConverter />
                    <CryptoToDigitalBalanceConverter />
                  </div>
              </div>
           </div>
        </TabsContent>

        {/* FUNCTIONAL TABS */}
        <TabsContent value="deposit" className="animate-in fade-in-50 duration-300">
             <div className="max-w-4xl mx-auto">
                 <DepositPage embedded={true} />
             </div>
        </TabsContent>

        <TabsContent value="withdraw" className="animate-in fade-in-50 duration-300">
             {hasAnyBalance ? (
                <div className="max-w-4xl mx-auto">
                     <WithdrawPage embedded={true} />
                 </div>
             ) : (
                 <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300">
                    <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Withdrawal Disabled</h3>
                    <p className="text-muted-foreground mt-2">You need to deposit funds before you can withdraw.</p>
                 </div>
             )}
        </TabsContent>

        <TabsContent value="send" className="animate-in fade-in-50 duration-300">
            {hasAnyBalance ? (
                <div className="max-w-4xl mx-auto">
                     <SendMoneyPage embedded={true} />
                 </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300">
                    <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Sending Disabled</h3>
                    <p className="text-muted-foreground mt-2">You need to deposit funds before you can send money.</p>
                </div>
            )}
        </TabsContent>

        <TabsContent value="receive" className="animate-in fade-in-50 duration-300">
            <div className="max-w-4xl mx-auto">
                 <ReceiveMoneyPage embedded={true} />
             </div>
        </TabsContent>

      </Tabs>
    </StandardPageWrapper>
  );
};

export default UserDashboardPage;