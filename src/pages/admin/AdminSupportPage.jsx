import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ArrowUp, BookOpen, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminSupportPage = () => {
    const { toast } = useToast();

    const tickets = [
        { id: 'TKT-001', subject: 'Login Issue', status: 'Open', priority: 'High', assignedTo: 'Support Team', lastUpdate: '5 mins ago' },
        { id: 'TKT-002', subject: 'Payout Delayed', status: 'In Progress', priority: 'High', assignedTo: 'Jane Smith', lastUpdate: '1 hour ago' },
        { id: 'TKT-003', subject: 'How to add new product?', status: 'Resolved', priority: 'Low', assignedTo: 'John Doe', lastUpdate: '1 day ago' },
    ];

    const handleAction = () => {
        toast({
            title: "🚧 Feature in Progress",
            description: "This functionality is coming soon!",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Support Center</h1>
                    <p className="text-muted-foreground">Manage support requests and resources.</p>
                </div>
                <Button onClick={handleAction}><PlusCircle className="mr-2 h-4 w-4" /> Create New Ticket</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Support Ticketing System</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ticket ID</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-mono">{ticket.id}</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell>
                                        <Badge variant={ticket.status === 'Resolved' ? 'success' : 'default'}>{ticket.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={ticket.priority === 'High' ? 'destructive' : 'secondary'}>{ticket.priority}</Badge>
                                    </TableCell>
                                    <TableCell>{ticket.assignedTo}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={handleAction}>View Ticket</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Knowledge Base Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Update FAQs and troubleshooting guides.</p>
                        <Button onClick={handleAction} variant="secondary">
                            <BookOpen className="mr-2 h-4 w-4" /> Manage Articles
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Communication Channels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Configure email, chat, and phone support.</p>
                        <Button onClick={handleAction} variant="secondary">
                            <MessageSquare className="mr-2 h-4 w-4" /> Configure Channels
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSupportPage;