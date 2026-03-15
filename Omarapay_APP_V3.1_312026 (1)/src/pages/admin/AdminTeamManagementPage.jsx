import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Edit, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminTeamManagementPage = () => {
    const { toast } = useToast();

    const teams = [
        { name: 'Sales', lead: 'John Doe', members: 8 },
        { name: 'Support', lead: 'Jane Smith', members: 12 },
        { name: 'Development', lead: 'Peter Jones', members: 15 },
        { name: 'Finance', lead: 'Alice Williams', members: 5 },
    ];
    
    const handleAction = () => {
        toast({
            title: "🚧 Feature in Progress",
            description: "This functionality is coming soon!",
        });
    };
    
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('');
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Team Management</h1>
                    <p className="text-muted-foreground">Create, manage, and organize internal OMARA teams.</p>
                </div>
                <Button onClick={handleAction}><PlusCircle className="mr-2 h-4 w-4" /> Create New Team</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Team Name</TableHead>
                                <TableHead>Team Lead</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teams.map((team) => (
                                <TableRow key={team.name}>
                                    <TableCell className="font-medium">{team.name}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{getInitials(team.lead)}</AvatarFallback>
                                        </Avatar>
                                        {team.lead}
                                    </TableCell>
                                    <TableCell>{team.members}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="sm" onClick={handleAction}>
                                            <Users className="mr-2 h-4 w-4" /> View Members
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleAction}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminTeamManagementPage;