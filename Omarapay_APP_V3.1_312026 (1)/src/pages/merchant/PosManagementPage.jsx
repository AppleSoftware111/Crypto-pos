import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Store } from 'lucide-react';
import { getCashiers } from '@/lib/posApi';
import { getPersistedPosCompanySnapshot } from '@/lib/posSessionStorage';
import { getPOSApiBaseUrl } from '@/config/posConfig';

const PosManagementPage = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [companyLabel, setCompanyLabel] = useState(null);

    const load = useCallback(async () => {
        const snap = getPersistedPosCompanySnapshot();
        if (!snap?.id) {
            setRows([]);
            setCompanyLabel(null);
            setError(null);
            setLoading(false);
            return;
        }
        setCompanyLabel(snap.name || snap.id);
        setLoading(true);
        setError(null);
        try {
            const list = await getCashiers(snap.id);
            setRows(Array.isArray(list) ? list : []);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'Could not load cashiers');
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const hasSnapshot = !!getPersistedPosCompanySnapshot()?.id;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold">POS Management</h1>
                    <p className="text-muted-foreground">
                        Cashier terminals from your Crypto POS backend (same list as the cashier login screen).
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link to="/merchant/cashier">
                        <Store className="mr-2 h-4 w-4" />
                        Open cashier terminal
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cashier terminals</CardTitle>
                    <CardDescription>
                        API: {getPOSApiBaseUrl()}
                        {companyLabel ? ` · Company: ${companyLabel}` : ''}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            Loading terminals…
                        </div>
                    ) : error ? (
                        <p className="text-sm text-destructive">{error}</p>
                    ) : !hasSnapshot ? (
                        <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
                            <p className="text-sm text-muted-foreground">
                                No POS session in this browser yet. Sign in once on the cashier terminal so we can list your terminals and keep merchant analytics in sync.
                            </p>
                            <Button asChild>
                                <Link to="/merchant/cashier">Go to cashier terminal</Link>
                            </Button>
                        </div>
                    ) : rows.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No cashier terminals returned for this company.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Terminal ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last login</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-mono text-xs">{c.id}</TableCell>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={c.status === 'active' ? 'default' : 'secondary'}>
                                                {c.status || '—'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {c.last_login ? new Date(c.last_login).toLocaleString() : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Add more terminals</CardTitle>
                    <CardDescription>
                        Create additional cashier accounts via the Crypto POS admin API.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                        Authenticate to <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/admin</code>, then call{' '}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">POST /api/admin/pos/cashiers</code> with body{' '}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">companyId</code>,{' '}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">name</code>,{' '}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">password</code>.
                        See <code className="rounded bg-muted px-1 py-0.5 text-xs">CLIENT_POS_RUNBOOK.md</code> in the repo.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default PosManagementPage;
