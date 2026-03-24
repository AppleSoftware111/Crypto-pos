import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deactivateAdminUser,
  isPOSAdminConfigured,
} from '@/lib/posAdminApi';
import { getPOSApiBaseUrl } from '@/config/posConfig';
import { useToast } from '@/components/ui/use-toast';
import {
  Users,
  RefreshCw,
  Loader2,
  AlertCircle,
  MoreHorizontal,
  UserPlus,
} from 'lucide-react';

function statusBadgeVariant(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'active') return 'default';
  if (s === 'inactive' || s === 'suspended') return 'destructive';
  return 'secondary';
}

export default function AdminUsersPage() {
  const baseUrl = getPOSApiBaseUrl();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    provider: '',
    status: '',
    limit: 100,
    offset: 0,
  });
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user',
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    email_verified: false,
    password: '',
  });

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const f = filtersRef.current;
      const params = {
        limit: f.limit,
        offset: f.offset,
      };
      if (f.search.trim()) params.search = f.search.trim();
      if (f.role) params.role = f.role;
      if (f.provider) params.provider = f.provider;
      if (f.status) params.status = f.status;

      const data = await getAdminUsers(params);
      setUsers(Array.isArray(data.users) ? data.users : []);
      setTotal(typeof data.total === 'number' ? data.total : data.users?.length ?? 0);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load users');
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'user',
      status: u.status || 'active',
      email_verified: Boolean(u.email_verified),
      password: '',
    });
    setEditOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAdminUser({
        email: createForm.email.trim(),
        password: createForm.password,
        name: createForm.name.trim(),
        role: createForm.role,
      });
      toast({ title: 'User created' });
      setCreateOpen(false);
      setCreateForm({ email: '', password: '', name: '', role: 'user' });
      load();
    } catch (err) {
      toast({
        title: err.response?.data?.error || 'Failed to create user',
        variant: 'destructive',
      });
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      const body = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
        status: editForm.status,
        email_verified: editForm.email_verified,
      };
      if (editForm.password.trim()) {
        body.password = editForm.password;
      }
      await updateAdminUser(editUser.id, body);
      toast({ title: 'User updated' });
      setEditOpen(false);
      setEditUser(null);
      load();
    } catch (err) {
      toast({
        title: err.response?.data?.error || 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await deactivateAdminUser(deactivateTarget.id);
      toast({ title: 'User deactivated' });
      setDeactivateOpen(false);
      setDeactivateTarget(null);
      load();
    } catch (err) {
      toast({
        title: err.response?.data?.error || 'Failed to deactivate user',
        variant: 'destructive',
      });
    }
  };

  const configured = isPOSAdminConfigured();

  if (!configured) {
    return (
      <StandardPageWrapper title="User management" subtitle="App user accounts (email / Google)">
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
    <StandardPageWrapper
      title="User management"
      subtitle="Create, update, and deactivate app users (Crypto POS auth store)"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Users
            </CardTitle>
            <CardDescription>
              {total} user{total !== 1 ? 's' : ''} matching filters. Deactivate revokes sessions (soft delete).
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add user
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 py-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="filter-search">Search</Label>
              <Input
                id="filter-search"
                placeholder="Email or name"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-role">Role</Label>
              <select
                id="filter-role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.role}
                onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="">All</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-provider">Provider</Label>
              <Input
                id="filter-provider"
                placeholder="e.g. google"
                value={filters.provider}
                onChange={(e) => setFilters((f) => ({ ...f, provider: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <select
                id="filter-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="">All</option>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="suspended">suspended</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="secondary" className="w-full" onClick={load} disabled={loading}>
                Apply
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-xs max-w-[140px] truncate" title={u.id}>
                      {u.id}
                    </TableCell>
                    <TableCell className="font-medium">{u.name || '—'}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="text-sm">{u.provider || '—'}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(u.status)}>{u.status || '—'}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {u.created_at ? new Date(u.created_at).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {u.last_login ? new Date(u.last_login).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Actions</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEdit(u)}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setDeactivateTarget(u);
                              setDeactivateOpen(true);
                            }}
                          >
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && users.length === 0 && !error && (
            <p className="text-center text-muted-foreground py-8">No users match the filters.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Add user</DialogTitle>
              <DialogDescription>
                Creates an email/password user. Password must be 8+ chars with upper, lower, and a number.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <Input
                  id="create-name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">Password</Label>
                <Input
                  id="create-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Role</Label>
                <select
                  id="create-role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={createForm.role}
                  onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleEditSave}>
            <DialogHeader>
              <DialogTitle>Edit user</DialogTitle>
              <DialogDescription>
                Update profile, role, or status. Setting status to inactive or suspended revokes refresh tokens.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editForm.role}
                  onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editForm.status}
                  onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="suspended">suspended</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-verified"
                  checked={editForm.email_verified}
                  onChange={(e) => setEditForm((f) => ({ ...f, email_verified: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="edit-verified" className="font-normal cursor-pointer">
                  Email verified
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">New password (optional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current"
                  value={editForm.password}
                  onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate user?</DialogTitle>
            <DialogDescription>
              This sets the account to inactive and revokes all refresh tokens. The user cannot sign in until
              reactivated.
            </DialogDescription>
          </DialogHeader>
          {deactivateTarget && (
            <p className="text-sm text-muted-foreground font-mono break-all">{deactivateTarget.email}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeactivate}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StandardPageWrapper>
  );
}
