import React, { useState, useEffect } from 'react';
import { useBusiness } from '@/context/BusinessContext';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REGISTRATION_STATUS, RISK_LEVELS } from '@/lib/businessSchema';
import StatusBadge from '@/components/common/StatusBadge';
import { Search, Filter, Eye, CheckCircle, XCircle, FileText, RefreshCw, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

const AdminBusinessApprovalPage = () => {
    const { 
        adminQueue, 
        getAdminQueue, 
        approveBusinessRegistration, 
        rejectBusinessRegistration, 
        requestMoreDocuments 
    } = useBusiness();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    
    // Action Dialog State
    const [dialogConfig, setDialogConfig] = useState({
        open: false,
        type: null, // 'APPROVE' | 'REJECT' | 'REQUEST_INFO'
        businessId: null,
        title: ''
    });
    const [actionReason, setActionReason] = useState('');
    const [riskLevel, setRiskLevel] = useState(RISK_LEVELS.MEDIUM);

    // Auto-refresh queue
    useEffect(() => {
        getAdminQueue();
        const interval = setInterval(() => {
            getAdminQueue();
        }, 30000);
        return () => clearInterval(interval);
    }, [getAdminQueue]);

    const filteredQueue = adminQueue.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            item.businessName?.toLowerCase().includes(searchLower) ||
            item.businessId?.toLowerCase().includes(searchLower) ||
            item.walletAddress?.toLowerCase().includes(searchLower)
        );
    });

    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const openActionDialog = (type, businessId) => {
        let title = '';
        if (type === 'APPROVE') title = 'Approve Business';
        else if (type === 'REJECT') title = 'Reject Application';
        else if (type === 'REQUEST_INFO') title = 'Request More Documents';

        setDialogConfig({ open: true, type, businessId, title });
        setActionReason('');
        setRiskLevel(RISK_LEVELS.MEDIUM);
    };

    const handleConfirmAction = async () => {
        const { type, businessId } = dialogConfig;
        
        if (type === 'APPROVE') {
            await approveBusinessRegistration(businessId, riskLevel);
        } else if (type === 'REJECT') {
            if (!actionReason) return; 
            await rejectBusinessRegistration(businessId, actionReason);
        } else if (type === 'REQUEST_INFO') {
            if (!actionReason) return;
            await requestMoreDocuments(businessId, actionReason);
        }

        setDialogConfig({ open: false, type: null, businessId: null, title: '' });
    };

    // Helper to extract address string safely from new nested or old structure
    const getAddressString = (item) => {
        if (item.address?.formatted) return item.address.formatted;
        if (item.address?.city && item.address?.country) return `${item.address.city}, ${item.address.country}`;
        // Fallback for old data structure
        if (item.city) return `${item.city}, ${item.country}`;
        return "Address unavailable";
    };

    return (
        <StandardPageWrapper title="Business Approvals" subtitle="Review pending business registration requests.">
            
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                        placeholder="Search name, wallet, ID..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-9 px-3 text-sm">
                        Queue: {adminQueue.length}
                    </Badge>
                    <Button variant="outline" size="icon" onClick={() => getAdminQueue()}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Business Info</TableHead>
                                <TableHead>Wallet Address</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>Docs</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredQueue.length > 0 ? filteredQueue.map((item) => (
                                <React.Fragment key={item.businessId}>
                                    <TableRow className={expandedRows[item.businessId] ? "bg-muted/50" : ""}>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => toggleRow(item.businessId)}>
                                                {expandedRows[item.businessId] ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.businessName}</div>
                                            <div className="text-xs text-muted-foreground">{item.businessType}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{item.businessId}</div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs max-w-[150px] truncate" title={item.walletAddress}>
                                            {item.walletAddress}
                                        </TableCell>
                                        <TableCell className="text-xs max-w-[150px] truncate">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                                <span title={getAddressString(item)}>{getAddressString(item)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {new Date(item.submittedAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.documentsCount}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={item.status} />
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button 
                                                variant="outline" size="sm" 
                                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                onClick={() => openActionDialog('REQUEST_INFO', item.businessId)}
                                            >
                                                Request Info
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => openActionDialog('APPROVE', item.businessId)}
                                            >
                                                Approve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    
                                    {/* Expanded Documents View */}
                                    {expandedRows[item.businessId] && (
                                        <TableRow className="bg-muted/30">
                                            <TableCell colSpan={8} className="p-4">
                                                <div className="bg-background rounded-lg border p-4">
                                                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                                        <FileText className="w-4 h-4" /> Submitted Documents
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {item.documents && item.documents.map((doc, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-2 border rounded bg-white dark:bg-slate-950">
                                                                <div className="overflow-hidden">
                                                                    <p className="text-xs font-semibold">{doc.documentType}</p>
                                                                    <p className="text-[10px] text-muted-foreground truncate" title={doc.fileName}>{doc.fileName}</p>
                                                                </div>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                    <Eye className="w-3 h-3 text-blue-500" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        {(!item.documents || item.documents.length === 0) && (
                                                            <p className="text-sm text-muted-foreground italic">No documents found.</p>
                                                        )}
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                        <Button 
                                                            variant="destructive" size="sm"
                                                            onClick={() => openActionDialog('REJECT', item.businessId)}
                                                        >
                                                            Reject Application
                                                        </Button>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No pending items in queue.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Action Dialog */}
            <Dialog open={dialogConfig.open} onOpenChange={(open) => !open && setDialogConfig(prev => ({ ...prev, open: false }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogConfig.title}</DialogTitle>
                        <DialogDescription>
                            Business ID: {dialogConfig.businessId}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        {dialogConfig.type === 'APPROVE' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assign Risk Level</label>
                                <Select value={riskLevel} onValueChange={setRiskLevel}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={RISK_LEVELS.LOW}>Low Risk</SelectItem>
                                        <SelectItem value={RISK_LEVELS.MEDIUM}>Medium Risk</SelectItem>
                                        <SelectItem value={RISK_LEVELS.HIGH}>High Risk</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {(dialogConfig.type === 'REJECT' || dialogConfig.type === 'REQUEST_INFO') && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {dialogConfig.type === 'REJECT' ? 'Rejection Reason' : 'Information Requested'}
                                </label>
                                <Textarea 
                                    placeholder={dialogConfig.type === 'REJECT' ? "e.g., Documents unclear..." : "e.g., Please upload a clearer copy of ID..."}
                                    value={actionReason}
                                    onChange={(e) => setActionReason(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogConfig(prev => ({ ...prev, open: false }))}>
                            Cancel
                        </Button>
                        <Button 
                            variant={dialogConfig.type === 'REJECT' ? 'destructive' : 'default'}
                            onClick={handleConfirmAction}
                            disabled={
                                (dialogConfig.type !== 'APPROVE' && !actionReason.trim())
                            }
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </StandardPageWrapper>
    );
};

export default AdminBusinessApprovalPage;