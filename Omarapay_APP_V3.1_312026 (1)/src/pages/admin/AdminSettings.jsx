import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { getAdminLogs, clearAdminLogs } from '@/lib/adminActionLogger';
import { SUPER_ADMIN_WHITELIST } from '@/config/adminConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Trash2, Download, History, UserCheck } from 'lucide-react';

const AdminSettings = () => {
  const { adminAddress } = useAdmin();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(getAdminLogs());
  }, []);

  const handleClearLogs = () => {
      if (confirm('Are you sure you want to clear all action logs? This cannot be undone.')) {
          clearAdminLogs();
          setLogs([]);
      }
  };

  const handleExportLogs = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "admin_logs.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold">Settings & Administration</h1>
            <p className="text-muted-foreground">Manage system access and review audit logs.</p>
        </div>

        <Tabs defaultValue="admins">
            <TabsList>
                <TabsTrigger value="admins">Admin Whitelist</TabsTrigger>
                <TabsTrigger value="logs">Audit Logs</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="admins" className="space-y-4 mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" /> Authorized Super Admins
                        </CardTitle>
                        <CardDescription>
                            These wallet addresses have full access to the Admin Dashboard.
                            Configuration is currently read-only (managed in code).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Wallet Address</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Label</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {SUPER_ADMIN_WHITELIST.map((addr, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-mono">{addr}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {addr.toLowerCase() === adminAddress?.toLowerCase() ? (
                                                <span className="flex items-center gap-1 text-primary font-medium">
                                                    <UserCheck className="h-3 w-3" /> You
                                                </span>
                                            ) : "Admin"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4 mt-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" /> Action History
                            </CardTitle>
                            <CardDescription>Log of sensitive actions performed by admins.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleExportLogs}>
                                <Download className="h-4 w-4 mr-2" /> Export
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleClearLogs}>
                                <Trash2 className="h-4 w-4 mr-2" /> Clear
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="rounded-md border max-h-[500px] overflow-y-auto">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                                    <TableRow>
                                        <TableHead className="w-[180px]">Timestamp</TableHead>
                                        <TableHead>Admin</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No logs recorded yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {log.admin.slice(0, 8)}...
                                                </TableCell>
                                                <TableCell className="font-medium text-sm">
                                                    {log.action}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground font-mono max-w-[200px] truncate">
                                                    {JSON.stringify(log.details)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-4">
                <Card>
                     <CardHeader>
                        <CardTitle>Security Configuration</CardTitle>
                        <CardDescription>Global security settings for the admin panel.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900">
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-500 mb-2">Whitelist Enforcement</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                Strict whitelist enforcement is active. Only addresses hardcoded in <code>src/config/adminConfig.js</code> can access this panel.
                                To add a new admin, a code deployment is required.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
};

export default AdminSettings;