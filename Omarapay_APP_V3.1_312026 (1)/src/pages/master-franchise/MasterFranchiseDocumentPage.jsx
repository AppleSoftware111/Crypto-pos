import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const documents = [
    { merchant: "Alice's Adventures", doc: "Business Permit", status: 'Verified' },
    { merchant: "Bob's Burgers", doc: "Owner ID", status: 'Pending Review' },
];

const MasterFranchiseDocumentPage = () => {
    const { toast } = useToast();

    const handleUpload = (e) => {
        e.preventDefault();
        toast({
            title: "Document Uploaded",
            description: "The document is now pending review by OMARA.",
        });
        e.target.reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Document Management</h1>
                <p className="text-muted-foreground">Manage KYC/KYB documents for your merchants.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Merchant Document</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpload} className="space-y-4 max-w-lg">
                        <div className="space-y-2"><Label htmlFor="doc-merchant-id">Merchant ID</Label><Input id="doc-merchant-id" placeholder="Enter merchant ID" required/></div>
                        <div className="space-y-2"><Label htmlFor="doc-file">Document</Label><Input id="doc-file" type="file" required/></div>
                        <Button type="submit">Upload for Review</Button>
                    </form>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Document Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Merchant</TableHead>
                                <TableHead>Document Type</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc, index) => (
                                <TableRow key={index}>
                                    <TableCell>{doc.merchant}</TableCell>
                                    <TableCell>{doc.doc}</TableCell>
                                    <TableCell><Badge variant={doc.status === 'Verified' ? 'success' : 'warning'}>{doc.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseDocumentPage;