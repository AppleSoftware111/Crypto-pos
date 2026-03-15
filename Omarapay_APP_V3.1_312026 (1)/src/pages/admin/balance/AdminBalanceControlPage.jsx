import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { logAdminAction } from '@/lib/adminActionLogger';

const AdminBalanceControlPage = () => {
  const { adminAddress } = useAdmin();

  // Task 9: Log access on mount
  useEffect(() => {
    logAdminAction(adminAddress, 'PAGE_ACCESS', { page: 'BalanceControl' });
  }, [adminAddress]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Balance Management</h2>
          <p className="text-muted-foreground">Monitor and control global liquidity pools.</p>
        </div>
        <Button>
            <RefreshCw className="mr-2 h-4 w-4" /> Sync Balances
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fiat Reserves</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234,567.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crypto Assets (USD Eq)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,567,890.00</div>
            <p className="text-xs text-muted-foreground">+12.5% from last week</p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquidity Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Low PHP</div>
            <p className="text-xs text-muted-foreground">PHP Pool &lt; 15% threshold</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Content placeholder - logic would go here */}
      <div className="min-h-[400px] border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground bg-gray-50 dark:bg-gray-900/50">
          Balance Control Table & Actions
      </div>
    </div>
  );
};

export default AdminBalanceControlPage;