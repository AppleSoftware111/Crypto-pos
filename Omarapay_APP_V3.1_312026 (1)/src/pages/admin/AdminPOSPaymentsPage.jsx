import React, { useState, useEffect, useCallback } from 'react';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getPOSAdminPayments, getPOSReceipt, isPOSAdminConfigured } from '@/lib/posAdminApi';
import { getPOSApiBaseUrl } from '@/config/posConfig';
import { Receipt, RefreshCw, Loader2, AlertCircle, FileText } from 'lucide-react';

export default function AdminPOSPaymentsPage() {
  const baseUrl = getPOSApiBaseUrl();
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
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptId, setReceiptId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: filters.limit, offset: filters.offset };
      if (filters.status) params.status = filters.status;
      if (filters.method) params.method = filters.method;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate + 'T23:59:59.999Z';
      const data = await getPOSAdminPayments(params);
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load POS payments');
    } finally {
      setLoading(false);
    }
  }, [filters.limit, filters.offset, filters.status, filters.method, filters.startDate, filters.endDate]);

  useEffect(() => {
    load();
  }, [load]);

  const openReceipt = async (paymentId) => {
    setReceiptId(paymentId);
    setReceiptDialogOpen(true);
    setReceiptData(null);
    setReceiptLoading(true);
    try {
      const data = await getPOSReceipt(paymentId);
      setReceiptData(data);
    } catch (err) {
      setReceiptData({ error: err.response?.data?.error || err.message || 'Failed to load receipt' });
    } finally {
      setReceiptLoading(false);
    }
  };

  const configured = isPOSAdminConfigured();
  const list = Array.isArray(payments) ? payments : [];

  if (!configured) {
    return (
      <StandardPageWrapper title="POS Payments" subtitle="Crypto POS payment history">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not configured</AlertTitle>
          <AlertDescription>
            Set VITE_POS_ADMIN_API_KEY in your environment and ensure the Crypto POS backend is running at {baseUrl}.
            Then rebuild the app.
          </AlertDescription>
        </Alert>
      </StandardPageWrapper>
    );
  }

  return (
    <StandardPageWrapper title="POS Payments" subtitle="Crypto POS — payment history and receipts">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" /> Payment history
            </CardTitle>
            <CardDescription>
              View and filter payments. Click &quot;Receipt&quot; to see full receipt data.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <select
                id="filter-status"
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
              <Label htmlFor="filter-method">Method</Label>
              <Input
                id="filter-method"
                placeholder="e.g. btc"
                value={filters.method}
                onChange={(e) => setFilters((f) => ({ ...f, method: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-start">From date</Label>
              <Input
                id="filter-start"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-end">To date</Label>
              <Input
                id="filter-end"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button variant="secondary" onClick={load} disabled={loading}>
                Apply filters
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading && list.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs max-w-[120px] truncate" title={p.id}>
                      {p.id}
                    </TableCell>
                    <TableCell>{p.method || '—'}</TableCell>
                    <TableCell className="font-medium">{p.amount ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={p.confirmed ? 'default' : 'secondary'}>
                        {p.confirmed ? 'Confirmed' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.created_at ? new Date(p.created_at).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openReceipt(p.id)}>
                        <FileText className="h-4 w-4 mr-1" /> Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && list.length === 0 && !error && (
            <p className="text-center text-muted-foreground py-8">No payments yet.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Receipt {receiptId}</DialogTitle>
          </DialogHeader>
          {receiptLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : receiptData?.error ? (
            <p className="text-destructive">{receiptData.error}</p>
          ) : receiptData ? (
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-mono break-all">{receiptData.paymentId || receiptData.id}</span>
                <span className="text-muted-foreground">Method</span>
                <span>{receiptData.method || receiptData.symbol || '—'}</span>
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{receiptData.amount ?? '—'}</span>
                <span className="text-muted-foreground">Status</span>
                <span>{receiptData.confirmed ? 'Confirmed' : 'Pending'}</span>
                <span className="text-muted-foreground">Created</span>
                <span>{receiptData.created_at ? new Date(receiptData.created_at).toLocaleString() : '—'}</span>
              </div>
              {receiptData.address && (
                <>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="font-mono text-xs break-all bg-muted p-2 rounded">{receiptData.address}</p>
                </>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </StandardPageWrapper>
  );
}
