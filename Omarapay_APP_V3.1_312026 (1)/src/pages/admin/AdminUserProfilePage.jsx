import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUsers } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UserProfileDetail = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 dark:text-gray-100">{value || 'N/A'}</p>
    </div>
);

const AdminUserProfilePage = () => {
    const { userId } = useParams();
    const { getUserById } = useUsers();
    const user = getUserById(userId);

    if (!user) {
        return (
            <div>
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p>The user you are looking for does not exist.</p>
                <Button asChild className="mt-4">
                    <Link to="/admin/users"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Users</Link>
                </Button>
            </div>
        );
    }
    
    const getStatusVariant = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Pending': return 'warning';
            case 'Denied': return 'destructive';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button asChild variant="outline" size="icon">
                    <Link to="/admin/users">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Comprehensive information for this user account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        <UserProfileDetail label="User ID" value={user.id} />
                        <UserProfileDetail label="Full Name" value={user.name} />
                        <UserProfileDetail label="Email Address" value={user.email} />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b">
                            <p className="text-sm font-medium text-gray-500">Role</p>
                            <p className="text-sm text-gray-900 dark:text-gray-100">{user.role}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b">
                            <p className="text-sm font-medium text-gray-500">Status</p>
                             <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                        </div>
                        <UserProfileDetail label="Joined Date" value={user.joined} />
                    </div>
                </CardContent>
            </Card>

            {(user.role === 'Merchant' || user.role === 'MasterFranchise') && (
                <Card>
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                             <UserProfileDetail label="Business Name" value={user.businessName} />
                             <UserProfileDetail label="Business Phone" value={user.businessPhone} />
                             <UserProfileDetail label="Business Address" value={user.businessAddress} />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminUserProfilePage;