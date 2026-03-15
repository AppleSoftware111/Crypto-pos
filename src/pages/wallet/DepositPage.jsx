import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, Building2, Globe, Banknote, QrCode } from 'lucide-react';

// New Components
import ChainSwitcher from '@/components/wallet/ChainSwitcher';
import TokenManagement from '@/components/wallet/TokenManagement';
import PayoutDetails from '@/components/wallet/PayoutDetails';
import BankDeposit from '@/components/wallet/BankDeposit';
import EWalletIntegration from '@/components/wallet/EWalletIntegration';
import QRPhIntegration from '@/components/wallet/QRPhIntegration';

const DepositPage = () => {
  const { walletAddress } = useAuth();
  const { userCountry } = useUsers();
  const navigate = useNavigate();

  return (
    <StandardPageWrapper
        title="Deposit & Payments"
        subtitle="Manage your deposit methods, banks, and payment integrations."
    >
        <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/wallet')} className="pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Wallet
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Info */}
            <div className="space-y-6 lg:col-span-1">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2">Wallet Info</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className="text-green-600 font-medium">Active</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Region</span>
                                <span className="font-medium">{userCountry}</span>
                            </div>
                            <div className="pt-2 border-t">
                                <span className="text-xs text-muted-foreground block mb-1">Address</span>
                                <code className="bg-white px-2 py-1 rounded border text-xs break-all">
                                    {walletAddress || 'Not Connected'}
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Security Notice</p>
                    <p>Always verify the network and address before depositing funds. Transactions are irreversible.</p>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="lg:col-span-2">
                <Tabs defaultValue="crypto" className="space-y-6">
                    <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex w-auto min-w-full md:min-w-0">
                            <TabsTrigger value="crypto" className="gap-2"><Wallet className="w-4 h-4" /> Crypto</TabsTrigger>
                            <TabsTrigger value="bank" className="gap-2"><Building2 className="w-4 h-4" /> Bank</TabsTrigger>
                            <TabsTrigger value="ewallet" className="gap-2"><Globe className="w-4 h-4" /> E-Wallets</TabsTrigger>
                            <TabsTrigger value="payout" className="gap-2"><Banknote className="w-4 h-4" /> Payouts</TabsTrigger>
                            {userCountry === 'PH' && (
                                <TabsTrigger value="qrph" className="gap-2"><QrCode className="w-4 h-4" /> QR Ph</TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    <TabsContent value="crypto" className="space-y-6 animate-in fade-in-50">
                        {/* ChainSwitcher uses wagmi hooks, so it must be inside WagmiProvider (which wraps App) */}
                        <ChainSwitcher />
                        <TokenManagement />
                    </TabsContent>

                    <TabsContent value="bank" className="animate-in fade-in-50">
                        <BankDeposit />
                    </TabsContent>

                    <TabsContent value="ewallet" className="animate-in fade-in-50">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold">E-Wallet Integrations</h2>
                            <p className="text-sm text-muted-foreground">Link your local e-wallets for seamless transfers.</p>
                        </div>
                        <EWalletIntegration />
                    </TabsContent>

                    <TabsContent value="payout" className="animate-in fade-in-50">
                        <PayoutDetails />
                    </TabsContent>

                    <TabsContent value="qrph" className="animate-in fade-in-50">
                        <QRPhIntegration />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </StandardPageWrapper>
  );
};

export default DepositPage;