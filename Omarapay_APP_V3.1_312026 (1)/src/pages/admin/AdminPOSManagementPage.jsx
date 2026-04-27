import React, { useState, useEffect, useCallback } from 'react';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  getAdminPOSCompanies,
  getAdminPOSCashiers,
  createAdminPOSCashier,
  patchCompanySettlementAddresses,
  getPOSAdminCoins,
  isPOSAdminConfigured,
} from '@/lib/posAdminApi';
import { getPOSApiBaseUrl } from '@/config/posConfig';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Plus,
  Wallet,
  Store,
} from 'lucide-react';

export default function AdminPOSManagementPage() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [cashierMap, setCashierMap] = useState({});
  const [loadingCashiers, setLoadingCashiers] = useState({});
  const [createOpen, setCreateOpen] = useState(false);
  const [createCompanyId, setCreateCompanyId] = useState('');
  const [createName, setCreateName] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [settleOpen, setSettleOpen] = useState(false);
  const [settleCompany, setSettleCompany] = useState(null);
  const [settleForm, setSettleForm] = useState({});
  const [settleSaving, setSettleSaving] = useState(false);

  const configured = isPOSAdminConfigured();
  const baseUrl = getPOSApiBaseUrl();

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getAdminPOSCompanies();
      setCompanies(list);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCoins = useCallback(async () => {
    try {
      const list = await getPOSAdminCoins();
      setCoins(Array.isArray(list) ? list.filter((c) => c.enabled) : []);
    } catch {
      setCoins([]);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
    loadCoins();
  }, [loadCompanies, loadCoins]);

  const toggleExpand = async (companyId) => {
    if (expandedId === companyId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(companyId);
    if (cashierMap[companyId]) return;
    setLoadingCashiers((m) => ({ ...m, [companyId]: true }));
    try {
      const rows = await getAdminPOSCashiers(companyId);
      setCashierMap((m) => ({ ...m, [companyId]: rows }));
    } catch (err) {
      toast({
        title: 'Could not load terminals',
        description: err.response?.data?.error || err.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingCashiers((m) => ({ ...m, [companyId]: false }));
    }
  };

  const openCreate = (companyId) => {
    setCreateCompanyId(companyId);
    setCreateName('');
    setCreatePassword('');
    setCreateOpen(true);
  };

  const submitCreate = async () => {
    const name = String(createName || '').trim();
    const password = String(createPassword || '');
    if (!createCompanyId || !name || password.length < 4) {
      toast({ title: 'Fill all fields', description: 'Password must be at least 4 characters.', variant: 'destructive' });
      return;
    }
    setCreateSubmitting(true);
    try {
      await createAdminPOSCashier(createCompanyId, name, password);
      toast({ title: 'Terminal created', className: 'bg-emerald-50 border-emerald-200' });
      setCreateOpen(false);
      setCashierMap((m) => {
        const next = { ...m };
        delete next[createCompanyId];
        return next;
      });
      if (expandedId === createCompanyId) {
        const rows = await getAdminPOSCashiers(createCompanyId);
        setCashierMap((m) => ({ ...m, [createCompanyId]: rows }));
      }
    } catch (err) {
      toast({
        title: 'Create failed',
        description: err.response?.data?.error || err.message,
        variant: 'destructive',
      });
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openSettlements = (company) => {
    setSettleCompany(company);
    const initial = {};
    coins.forEach((c) => {
      const code = String(c.method_code || '').toLowerCase();
      if (code) initial[code] = company.settlement_addresses?.[code] || company.settlement_addresses?.[c.method_code] || '';
    });
    setSettleForm(initial);
    setSettleOpen(true);
  };

  const saveSettlements = async () => {
    if (!settleCompany) return;
    setSettleSaving(true);
    try {
      const cleaned = { ...settleForm };
      Object.keys(cleaned).forEach((k) => {
        if (!String(cleaned[k] || '').trim()) delete cleaned[k];
      });
      const updated = await patchCompanySettlementAddresses(settleCompany.id, cleaned);
      setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      toast({ title: 'Settlement addresses saved', className: 'bg-emerald-50 border-emerald-200' });
      setSettleOpen(false);
    } catch (err) {
      toast({
        title: 'Save failed',
        description: err.response?.data?.error || err.message,
        variant: 'destructive',
      });
    } finally {
      setSettleSaving(false);
    }
  };

  return (
    <StandardPageWrapper title="POS Management" subtitle="Companies, cashier terminals, and per-company receive wallets (Crypto POS)">
      <div className="space-y-6">
        {!configured && (
          <Alert>
            <AlertDescription>
              Configure <code className="text-xs">VITE_POS_ADMIN_API_KEY</code> to match the backend{' '}
              <code className="text-xs">ADMIN_API_KEY</code>, or sign in via Crypto POS admin so requests include a session
              cookie.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                POS companies &amp; terminals
              </CardTitle>
              <CardDescription>
                API: {baseUrl} — same backend as the POS app and merchant Connect POS.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadCompanies} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Refresh</span>
            </Button>
          </CardHeader>
          <CardContent>
            {loading && !companies.length ? (
              <div className="flex justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10" />
                    <TableHead>Company</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((co) => (
                    <React.Fragment key={co.id}>
                      <TableRow>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleExpand(co.id)}>
                            {expandedId === co.id ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{co.name}</TableCell>
                        <TableCell className="font-mono text-xs">{co.id}</TableCell>
                        <TableCell>
                          <Badge variant={co.status === 'active' ? 'default' : 'secondary'}>{co.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openSettlements(co)}>
                            <Wallet className="h-3 w-3 mr-1" />
                            Settlements
                          </Button>
                          <Button size="sm" onClick={() => openCreate(co.id)}>
                            <Plus className="h-3 w-3 mr-1" />
                            Add terminal
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedId === co.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/40 p-4">
                            {loadingCashiers[co.id] ? (
                              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Terminal</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {(cashierMap[co.id] || []).length === 0 ? (
                                    <TableRow>
                                      <TableCell colSpan={3} className="text-muted-foreground text-sm">
                                        No cashier terminals yet.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    (cashierMap[co.id] || []).map((t) => (
                                      <TableRow key={t.id}>
                                        <TableCell>{t.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{t.id}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">{t.status}</Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add cashier terminal</DialogTitle>
            <DialogDescription>
              Creates a new POS terminal for company <span className="font-mono">{createCompanyId}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label>Display name</Label>
              <Input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="e.g. Front desk" />
            </div>
            <div className="space-y-2">
              <Label>Terminal password</Label>
              <Input
                type="password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitCreate} disabled={createSubmitting}>
              {createSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={settleOpen} onOpenChange={setSettleOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>POS settlement addresses</DialogTitle>
            <DialogDescription>
              Optional per-method receive wallets for <strong>{settleCompany?.name}</strong>. When set, crypto POS payments
              for that method use this address instead of the global coin wallet. Leave blank to use the default coin
              address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {coins.map((c) => {
              const code = String(c.method_code || '').toLowerCase();
              if (!code) return null;
              return (
                <div key={c.id || code} className="space-y-1">
                  <Label className="text-xs">
                    {c.name} ({code})
                  </Label>
                  <Input
                    value={settleForm[code] ?? ''}
                    onChange={(e) => setSettleForm((f) => ({ ...f, [code]: e.target.value }))}
                    placeholder={c.wallet_address || 'Override address'}
                    className="font-mono text-sm"
                  />
                </div>
              );
            })}
            {coins.length === 0 && (
              <p className="text-sm text-muted-foreground">No enabled POS coins — configure under POS Coins first.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSettlements} disabled={settleSaving}>
              {settleSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StandardPageWrapper>
  );
}
