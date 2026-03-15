import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const tickets = [
    { id: 'TKT-001', subject: 'Issue with Merchant Payout', status: 'In Progress' },
    { id: 'TKT-002', subject: 'POS Terminal not connecting', status: 'Resolved' },
];

const MasterFranchiseSupportPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "Support Ticket Submitted",
            description: "Our team will get back to you shortly.",
        });
        e.target.reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Technical Support</h1>
                <p className="text-muted-foreground">Get help for your operational issues.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Request Technical Support</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                        <div className="space-y-2"><Label htmlFor="support-subject">Subject</Label><Textarea id="support-subject" placeholder="Describe your issue here..." required /></div>
                        <Button type="submit">Submit Ticket</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>My Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ticket ID</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map(ticket => (
                                <TableRow key={ticket.id}>
                                    <TableCell>{ticket.id}</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell><Badge variant={ticket.status === 'Resolved' ? 'success' : 'warning'}>{ticket.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default MasterFranchiseSupportPage;