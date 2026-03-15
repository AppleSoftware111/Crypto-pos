import React from 'react';
import { useUsers } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownLeft, Send, Plus, RefreshCw, Wallet, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BalanceCard = ({ currency, amount, rates, loading, isZero }) => {
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₱';
    
    if (loading) return <Skeleton className="h-32 w-full rounded-2xl" />;

    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className={`overflow-hidden relative border border-white/20 shadow-lg rounded-2xl glass-panel ${isZero ? 'opacity-90' : ''}`}>
                <div className={`absolute top-0 left-0 w-1.5 h-full ${currency === 'USD' ? 'bg-green-500' : currency === 'PHP' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-semibold text-muted-foreground tracking-wide">{currency} Wallet</span>
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <Wallet className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${isZero ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {symbol}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    {currency !== 'USD' && !isZero && (
                        <div className="text-xs font-medium text-muted-foreground bg-gray-100 dark:bg-gray-800/50 inline-block px-2 py-1 rounded-md">
                            ≈ ${(amount * (rates[`${currency}_USD`] || 0.018)).toFixed(2)} USD
                        </div>
                    )}
                    {isZero && (
                        <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1 font-medium">
                            <AlertCircle className="w-3 h-3" /> Deposit to activate
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

const DigitalBalanceDisplay = () => {
    const { digitalBalances, loading } = useUsers();
    const { walletAddress } = useAuth();
    
    const rates = { 'PHP_USD': 0.018, 'EUR_USD': 1.09 };
    const hasBalance = (digitalBalances?.USD > 0 || digitalBalances?.PHP > 0 || digitalBalances?.EUR > 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Assets</h2>
                    {walletAddress && (
                        <p className="text-xs font-mono text-muted-foreground mt-1 flex items-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                             Wallet: <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">{walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</span>
                        </p>
                    )}
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hidden sm:flex hover:rotate-180 transition-transform duration-500">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BalanceCard currency="USD" amount={digitalBalances.USD || 0} rates={rates} loading={loading} isZero={!digitalBalances.USD} />
                <BalanceCard currency="PHP" amount={digitalBalances.PHP || 0} rates={rates} loading={loading} isZero={!digitalBalances.PHP} />
                <BalanceCard currency="EUR" amount={digitalBalances.EUR || 0} rates={rates} loading={loading} isZero={!digitalBalances.EUR} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/wallet/deposit" className="contents">
                    <Button variant="outline" className="h-auto py-5 flex flex-col gap-2 rounded-xl border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all shadow-sm">
                        <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold">Deposit</span>
                    </Button>
                </Link>
                
                <Link to={hasBalance ? "/wallet/withdraw" : "#"} className={`contents ${!hasBalance ? 'pointer-events-none opacity-60' : ''}`}>
                    <Button variant="outline" className="h-auto py-5 flex flex-col gap-2 rounded-xl border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all shadow-sm">
                        <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold">Withdraw</span>
                    </Button>
                </Link>
                
                <Link to={hasBalance ? "/wallet/send" : "#"} className={`contents ${!hasBalance ? 'pointer-events-none opacity-60' : ''}`}>
                    <Button variant="outline" className="h-auto py-5 flex flex-col gap-2 rounded-xl border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all shadow-sm">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400">
                            <Send className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold">Send</span>
                    </Button>
                </Link>
                
                <Link to="/wallet/receive" className="contents">
                    <Button variant="outline" className="h-auto py-5 flex flex-col gap-2 rounded-xl border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all shadow-sm">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-600 dark:text-purple-400">
                            <ArrowDownLeft className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold">Receive</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default DigitalBalanceDisplay;