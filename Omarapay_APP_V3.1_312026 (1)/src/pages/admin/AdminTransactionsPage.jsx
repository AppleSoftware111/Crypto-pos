import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { getPOSAdminPayments, isPOSAdminConfigured } from '@/lib/posAdminApi';
import { getPOSApiBaseUrl } from '@/config/posConfig';

const AdminTransactionsPage = () => {
    const baseUrl = getPOSApiBaseUrl();
    const configured = isPOSAdminConfigured();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        method: '',
        startDate: '',
        endDate: '',
        limit: 100,
        offset: 0,
    });

    const load = useCallback(async () => {
        if (!configured) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const params = { limit: filters.limit, offset: filters.offset };
            if (filters.status) params.status = filters.status;
            if (filters.method) params.method = filters.method;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = `${filters.endDate}T23:59:59.999Z`;
            const data = await getPOSAdminPayments(params);
            setPayments(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to load backend POS transactions');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    }, [configured, filters.endDate, filters.limit, filters.method, filters.offset, filters.startDate, filters.status]);

    useEffect(() => {
        load();
    }, [load]);

    const totals = useMemo(() => {
        const confirmed = payments.filter((p) => p.confirmed === 1 || p.confirmed === true || p.status === 'confirmed');
        const confirmedAmount = confirmed.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        return {
            total: payments.length,
            confirmed: confirmed.length,
            pending: payments.length - confirmed.length,
            confirmedAmount,
        };
    }, [payments]);

    const formatAmount = (amount) => {
        const n = Number(amount);
        return Number.isFinite(n) ? `$${n.toFixed(2)}` : '—';
    };

    if (!configured) {
        return (
            <StandardPageWrapper title="All Transactions" subtitle="Backend POS sales ledger">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Admin POS API not configured</AlertTitle>
                    <AlertDescription>
                        This page reads real POS payments from {baseUrl}. Set VITE_POS_ADMIN_API_KEY to match
                        ADMIN_API_KEY, or sign in with a Crypto POS admin session.
                    </AlertDescription>
                </Alert>
            </StandardPageWrapper>
        );
    }

    return (
        <StandardPageWrapper
            title="All Transactions"
            subtitle="Real POS payments from the Crypto POS backend database"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Rows loaded</p>
                        <p className="text-2xl font-bold">{totals.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Confirmed</p>
                        <p className="text-2xl font-bold">{totals.confirmed}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Pending</p>
                        <p className="text-2xl font-bold">{totals.pending}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Confirmed sales</p>
                        <p className="text-2xl font-bold">{formatAmount(totals.confirmedAmount)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle>Backend POS Transaction Log</CardTitle>
                            <CardDescription>
                                Source: /api/admin/payments. This is the POS sales ledger, not merchant demo data or wallet activity.
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                            Refresh
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-tx-status">Status</Label>
                            <select
                                id="admin-tx-status"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={filters.status}
                                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-tx-method">Method</Label>
                            <Input
                                id="admin-tx-method"
                                placeholder="btc, visa..."
                                value={filters.method}
                                onChange={(e) => setFilters((f) => ({ ...f, method: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-tx-start">From</Label>
                            <Input
                                id="admin-tx-start"
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-tx-end">To</Label>
                            <Input
                                id="admin-tx-end"
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button variant="secondary" onClick={load} disabled={loading}>Apply</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {loading && payments.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payment ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Cashier</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => {
                                const confirmed = payment.confirmed === 1 || payment.confirmed === true || payment.status === 'confirmed';
                                return (
                                    <TableRow key={payment.id || payment.payment_id}>
                                        <TableCell className="font-mono text-xs max-w-[150px] truncate" title={payment.payment_id || payment.id}>
                                            {payment.payment_id || payment.id}
                                        </TableCell>
                                        <TableCell>{payment.created_at ? new Date(payment.created_at).toLocaleString() : '—'}</TableCell>
                                        <TableCell className="font-mono text-xs">{payment.company_id || 'Global/default'}</TableCell>
                                        <TableCell className="font-mono text-xs">{payment.cashier_id || '—'}</TableCell>
                                        <TableCell>{payment.coin_name || payment.method || '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={confirmed ? 'default' : 'secondary'}>
                                                {confirmed ? 'Confirmed' : 'Pending'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{formatAmount(payment.amount)}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {payments.length === 0 && !error && (
                                <TableRow>
                                    <TableCell colSpan="7" className="text-center py-8 text-gray-500">
                                        No live POS payments found on this backend yet. Generate a POS sale and refresh this page.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </StandardPageWrapper>
    );
};

export default AdminTransactionsPage;