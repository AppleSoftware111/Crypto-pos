import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, Clock, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

const EmployeeManagementPage = () => {
    const { toast } = useToast();

    const employees = [
        { id: 'EMP-01', name: 'Jane Doe', position: 'Supervisor', status: 'Active' },
        { id: 'EMP-02', name: 'John Smith', position: 'Cashier', status: 'Active' },
        { id: 'EMP-03', name: 'Sam Wilson', position: 'Cashier', status: 'On Leave' },
    ];

    const handleAction = (feature) => {
        toast({
            title: "🚧 Feature in Progress",
            description: `${feature} will be available soon!`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Employee Management</h1>
                    <p className="text-muted-foreground">Manage your staff, cashiers, and their roles.</p>
                </div>
                <Button onClick={() => handleAction('Adding a new employee')}><PlusCircle className="mr-2 h-4 w-4" /> Add Employee</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Staff & Cashiers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-mono">{employee.id}</TableCell>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>
                                        <Badge variant={employee.status === 'Active' ? 'success' : 'secondary'}>{employee.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleAction('Editing profile')}>Edit Profile</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction('Resetting PIN')}>Reset POS PIN</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
                        <CardTitle>Staff Attendance</CardTitle>
                        <CardDescription>Monitor employee check-in/out times.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => handleAction('Viewing attendance logs')}><Clock className="mr-2 h-4 w-4" /> View Attendance Logs</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Shift Management</CardTitle>
                        <CardDescription>Schedule and manage employee shifts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => handleAction('Managing shifts')}><Calendar className="mr-2 h-4 w-4" /> Manage Shifts</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmployeeManagementPage;