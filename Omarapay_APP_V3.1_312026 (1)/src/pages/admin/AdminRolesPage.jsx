import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Store, Briefcase } from 'lucide-react';

/**
 * Read-only overview of how access is split in this app (not a live RBAC matrix).
 */
const AdminRolesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Roles &amp; access</h1>
        <p className="text-muted-foreground">
          How Super Admin, merchant, and cashier flows fit together in Omara.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Super Admin (main office)</CardTitle>
            </div>
            <CardDescription>
              Full platform console at <code className="text-xs">/admin</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Connect a wallet on the admin whitelist and verify your signature. This is separate from the merchant
              storefront.
            </p>
            <p>
              Optionally, <strong>Crypto POS admin</strong> (username/password) signs in on the same admin login page to
              manage POS Coins and POS Payments via the POS API — it does not replace main-office wallet policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Merchant</CardTitle>
            </div>
            <CardDescription>Business back office</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Approved businesses use <code className="text-xs">/merchant/*</code> for dashboard, transactions,
              settings, and reports.
            </p>
            <p>
              <Link to="/merchant/dashboard" className="text-primary underline-offset-4 hover:underline">
                Open merchant dashboard
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Cashier / staff</CardTitle>
            </div>
            <CardDescription>In-store checkout</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              There is no separate &quot;cashier admin&quot; product. Staff use the POS flow: company login, then cashier
              login, then take payment.
            </p>
            <p>
              <Link to="/merchant/cashier" className="text-primary underline-offset-4 hover:underline">
                Cashier terminal
              </Link>
              {' · '}
              <Link to="/merchant/pos" className="text-primary underline-offset-4 hover:underline">
                Accept Payments
              </Link>
              {' '}
              (add <code className="text-xs">?kiosk=1</code> for kiosk toolbar on the same page)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRolesPage;
