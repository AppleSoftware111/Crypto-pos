import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LifeBuoy, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SupportPage = () => {
    const { toast } = useToast();

    const tickets = [
        { id: 'TKT-001', subject: 'Issue with POS terminal', status: 'Open', lastUpdate: '2025-07-18' },
        { id: 'TKT-002', subject: 'Question about fees', status: 'Resolved', lastUpdate: '2025-07-15' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "✅ Ticket Submitted!",
            description: "Your support request has been received. We'll get back to you shortly.",
        });
        e.target.reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Support & Ticketing</h1>
                <p className="text-muted-foreground">Get help and manage your support requests.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle>Create a New Support Ticket</CardTitle>
                        <CardDescription>Describe your issue and we'll get back to you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="e.g., Problem with crypto withdrawal" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Please provide as much detail as possible." required />
                            </div>
                            <Button type="submit" className="w-full"><Send className="mr-2 h-4 w-4" /> Submit Ticket</Button>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>My Support Tickets</CardTitle>
                        <CardDescription>Track the status of your submitted tickets.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell>{ticket.subject}</TableCell>
                                        <TableCell>
                                            <Badge variant={ticket.status === 'Open' ? 'default' : 'success'}>{ticket.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SupportPage;