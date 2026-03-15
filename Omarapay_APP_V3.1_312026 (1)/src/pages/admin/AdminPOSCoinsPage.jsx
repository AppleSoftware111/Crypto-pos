import React, { useState, useEffect } from 'react';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getPOSAdminCoins,
  getPOSAdminCoin,
  createPOSCoin,
  updatePOSCoin,
  deletePOSCoin,
  togglePOSCoin,
  isPOSAdminConfigured,
} from '@/lib/posAdminApi';
import { getPOSApiBaseUrl } from '@/config/posConfig';
import { useToast } from '@/components/ui/use-toast';
import { Coins, RefreshCw, Loader2, AlertCircle, Plus, Pencil, Trash2, Power, PowerOff } from 'lucide-react';

const defaultForm = {
  id: '',
  name: '',
  symbol: '',
  method_code: '',
  network: 'mainnet',
  wallet_address: '',
  api_url: '',
  api_key: '',
  contract_address: '',
  decimals: 18,
  icon: '',
  confirmations_required: 1,
  enabled: 1,
};

export default function AdminPOSCoinsPage() {
  const { toast } = useToast();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getPOSAdminCoins();
      setCoins(list);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load POS coins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const configured = isPOSAdminConfigured();
  const baseUrl = getPOSApiBaseUrl();

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = async (id) => {
    setActionLoading(id);
    try {
      const coin = await getPOSAdminCoin(id);
      setForm({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        method_code: coin.method_code,
        network: coin.network || 'mainnet',
        wallet_address: coin.wallet_address || '',
        api_url: coin.api_url || '',
        api_key: coin.api_key || '',
        contract_address: coin.contract_address || '',
        decimals: coin.decimals ?? 18,
        icon: coin.icon || '',
        confirmations_required: coin.confirmations_required ?? 1,
        enabled: coin.enabled === 1 || coin.enabled === true ? 1 : 0,
      });
      setEditingId(id);
      setDialogOpen(true);
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.error || err.message, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = {
        name: form.name,
        symbol: form.symbol,
        method_code: form.method_code,
        network: form.network,
        wallet_address: form.wallet_address || null,
        api_url: form.api_url || null,
        api_key: form.api_key || null,
        contract_address: form.contract_address || null,
        decimals: parseInt(form.decimals, 10) || 18,
        icon: form.icon || null,
        confirmations_required: parseInt(form.confirmations_required, 10) || 1,
        enabled: form.enabled ? 1 : 0,
      };
      if (editingId) {
        await updatePOSCoin(editingId, payload);
        toast({ title: 'Success', description: 'Coin updated successfully.' });
      } else {
        payload.id = form.id.trim();
        if (!payload.id) {
          toast({ title: 'Error', description: 'Coin ID is required.', variant: 'destructive' });
          setSubmitLoading(false);
          return;
        }
        await createPOSCoin(payload);
        toast({ title: 'Success', description: 'Coin created successfully.' });
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || err.message || 'Failed to save coin',
        variant: 'destructive',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggle = async (coin) => {
    setActionLoading(coin.id);
    try {
      await togglePOSCoin(coin.id, !coin.enabled);
      toast({ title: 'Success', description: `Coin ${coin.enabled ? 'disabled' : 'enabled'}.` });
      load();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.error || err.message, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (coin) => {
    if (!confirm(`Delete "${coin.name}"? This cannot be undone.`)) return;
    setActionLoading(coin.id);
    try {
      await deletePOSCoin(coin.id);
      toast({ title: 'Success', description: 'Coin deleted.' });
      load();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.error || err.message, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  if (!configured) {
    return (
      <StandardPageWrapper title="POS Coins" subtitle="Manage Crypto POS payment methods">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not configured</AlertTitle>
          <AlertDescription>
            Set VITE_POS_ADMIN_API_KEY in your environment and ensure the Crypto POS backend is running at {baseUrl}.
            Then rebuild the app. Admin API key must match ADMIN_API_KEY on the POS server.
          </AlertDescription>
        </Alert>
      </StandardPageWrapper>
    );
  }

  return (
    <StandardPageWrapper title="POS Coins" subtitle="Crypto POS — add, edit, and manage payment methods">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" /> Payment methods (coins)
            </CardTitle>
            <CardDescription>
              Manage coins on the POS backend. Changes apply to Accept Payments and mobile POS.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add coin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading && coins.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Method code</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="max-w-[180px]">Wallet address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coins.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.symbol}</TableCell>
                    <TableCell className="font-mono text-xs">{c.method_code}</TableCell>
                    <TableCell>{c.network || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={c.enabled ? 'default' : 'secondary'}>
                        {c.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[180px]" title={c.wallet_address}>
                      {c.wallet_address ? `${c.wallet_address.slice(0, 10)}...` : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(c.id)}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(c)}
                          disabled={actionLoading !== null}
                          title={c.enabled ? 'Disable' : 'Enable'}
                        >
                          {c.enabled ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(c)}
                          disabled={actionLoading !== null}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && coins.length === 0 && !error && (
            <p className="text-center text-muted-foreground py-8">No coins configured. Click &quot;Add coin&quot; to create one.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit coin' : 'Add new coin'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update coin settings.' : 'Unique ID is used in the API (e.g. btc, usdt-avax).'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coin-id">Coin ID *</Label>
                <Input
                  id="coin-id"
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                  placeholder="e.g. btc, usdt-avax"
                  disabled={!!editingId}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coin-name">Name *</Label>
                <Input
                  id="coin-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Bitcoin"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coin-symbol">Symbol *</Label>
                <Input
                  id="coin-symbol"
                  value={form.symbol}
                  onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
                  placeholder="BTC"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coin-method-code">Method code *</Label>
                <Input
                  id="coin-method-code"
                  value={form.method_code}
                  onChange={(e) => setForm((f) => ({ ...f, method_code: e.target.value }))}
                  placeholder="btc"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coin-network">Network</Label>
                <select
                  id="coin-network"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.network}
                  onChange={(e) => setForm((f) => ({ ...f, network: e.target.value }))}
                >
                  <option value="mainnet">Mainnet</option>
                  <option value="testnet">Testnet</option>
                </select>
              </div>
              <div className="space-y-2 flex items-end pb-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="coin-enabled"
                    checked={!!form.enabled}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v ? 1 : 0 }))}
                  />
                  <Label htmlFor="coin-enabled">Enabled</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coin-wallet">Wallet address *</Label>
              <Input
                id="coin-wallet"
                value={form.wallet_address}
                onChange={(e) => setForm((f) => ({ ...f, wallet_address: e.target.value }))}
                placeholder="0x... or bc1..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coin-api-url">API URL</Label>
                <Input
                  id="coin-api-url"
                  value={form.api_url}
                  onChange={(e) => setForm((f) => ({ ...f, api_url: e.target.value }))}
                  placeholder="https://api.snowtrace.io/api"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coin-api-key">API key</Label>
                <Input
                  id="coin-api-key"
                  type="password"
                  value={form.api_key}
                  onChange={(e) => setForm((f) => ({ ...f, api_key: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coin-contract">Contract address (tokens)</Label>
              <Input
                id="coin-contract"
                value={form.contract_address}
                onChange={(e) => setForm((f) => ({ ...f, contract_address: e.target.value }))}
                placeholder="For USDT, USDC, etc."
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coin-decimals">Decimals</Label>
                <Input
                  id="coin-decimals"
                  type="number"
                  min="0"
                  max="18"
                  value={form.decimals}
                  onChange={(e) => setForm((f) => ({ ...f, decimals: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coin-confirmations">Confirmations</Label>
                <Input
                  id="coin-confirmations"
                  type="number"
                  min="1"
                  value={form.confirmations_required}
                  onChange={(e) => setForm((f) => ({ ...f, confirmations_required: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coin-icon">Icon filename</Label>
                <Input
                  id="coin-icon"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="btc.png"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </StandardPageWrapper>
  );
}
