import React from 'react';
import { useUsers } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const AdminApplicationsPage = () => {
  const { applications, users } = useUsers();
  const { toast } = useToast();

  const getUserById = (userId) => users.find(u => u.id === userId);

  const handleReview = () => {
    toast({
      title: "🚧 Feature in Progress",
      description: "Application review functionality is not yet implemented.",
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Business Applications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => {
              const user = getUserById(app.userId);
              return (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.businessName}</TableCell>
                  <TableCell>{user ? user.name : 'Unknown User'}</TableCell>
                  <TableCell>{app.submitted}</TableCell>
                  <TableCell>
                    <Badge variant="warning">{app.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button onClick={handleReview}>Review Application</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminApplicationsPage;