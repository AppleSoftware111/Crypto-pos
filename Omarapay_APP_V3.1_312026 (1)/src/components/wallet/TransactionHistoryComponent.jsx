import React, { useState } from 'react';
import { useDigitalBalance } from '@/context/DigitalBalanceContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResponsiveTableWrapper from '@/components/layout/ResponsiveTableWrapper';

const TransactionHistoryComponent = ({ userEmailOnly = false, userEmail }) => {
  const { transactions } = useDigitalBalance();
  const { walletAddress } = useAuth();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(tx => {
    if (walletAddress && tx.walletAddress && tx.walletAddress !== walletAddress) return false;
    if (userEmailOnly && tx.user !== userEmail) return false;
    if (filter !== 'All' && tx.type !== filter) return false;
    if (search) {
        const s = search.toLowerCase();
        return (
            tx.id.toLowerCase().includes(s) || 
            tx.currency.toLowerCase().includes(s) ||
            (tx.details && JSON.stringify(tx.details).toLowerCase().includes(s))
        );
    }
    return true;
  });

  const getStatusColor = (status) => {
      switch(status?.toLowerCase()) {
          case 'completed': return 'bg-green-100 text-green-700 border-green-200';
          case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'failed': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
  };

  // Mobile Card Renderer
  const renderMobileCard = (tx) => (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.direction === 'Inbound' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.direction === 'Inbound' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                      <p className="font-semibold text-sm">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  </div>
              </div>
              <Badge variant="outline" className={getStatusColor(tx.status)}>{tx.status}</Badge>
          </div>
          <div className="flex justify-between items-center border-t pt-3 border-gray-100 dark:border-gray-700">
              <p className="text-xs text-muted-foreground font-mono">{tx.id.slice(0, 12)}...</p>
              <p className={`font-bold ${tx.direction === 'Inbound' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.direction === 'Inbound' ? '+' : '-'}{tx.currency} {tx.amount.toFixed(2)}
              </p>
          </div>
      </div>
  );

  return (
    <Card className="glass-panel border-0 shadow-lg rounded-2xl">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
            <CardTitle>History</CardTitle>
            {walletAddress && <p className="text-xs text-muted-foreground font-mono flex items-center gap-1"><Wallet className="w-3 h-3" /> {walletAddress.slice(0,8)}...</p>}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search..." 
                    className="pl-8 h-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                <Download className="w-4 h-4" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResponsiveTableWrapper 
            data={filtered} 
            columns={[]} 
            onRenderCard={renderMobileCard}
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filtered.map(tx => (
                            <TableRow key={tx.id}>
                                <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{tx.type}</span>
                                        <span className="text-xs text-muted-foreground">{tx.method || 'System'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className={`font-bold ${tx.direction === 'Inbound' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.direction === 'Inbound' ? '+' : '-'}{tx.currency} {tx.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(tx.status)}>
                                        {tx.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground text-right">
                                    {new Date(tx.timestamp).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </ResponsiveTableWrapper>
      </CardContent>
    </Card>
  );
};

export default TransactionHistoryComponent;