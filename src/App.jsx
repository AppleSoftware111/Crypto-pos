import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

// Utils & Guards
import ComposeProviders from '@/utils/ComposeProviders';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import ChainSelectionGuard from '@/components/auth/ChainSelectionGuard';
import CookieConsentBanner from '@/components/common/CookieConsentBanner';

// Global Components
import OmaraAIFixed from '@/components/omara/OmaraAIFixed';

// Public Pages
import LoginPortalPage from '@/pages/LoginPortalPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ChainSelectionPage from '@/pages/ChainSelectionPage';

// User/Wallet Pages
import UserDashboardPage from '@/pages/UserDashboardPage';
import UserWalletLayout from '@/components/user/UserWalletLayout';

// Business & Merchant Pages
import BusinessRegistrationPage from '@/pages/business/BusinessRegistrationPage';
import MerchantLayout from '@/components/merchant/MerchantLayout';
import MerchantDashboardPage from '@/pages/merchant/MerchantDashboardPage';
import TransactionsPage from '@/pages/merchant/TransactionsPage';
import PayoutsPage from '@/pages/merchant/PayoutsPage';
import ReportsPage from '@/pages/merchant/ReportsPage';
import SettingsPage from '@/pages/merchant/SettingsPage';
import CustomersPage from '@/pages/merchant/CustomersPage';
import InvoicesPage from '@/pages/merchant/InvoicesPage';
import ProductsPage from '@/pages/merchant/ProductsPage';
import AnalyticsPage from '@/pages/merchant/AnalyticsPage';
import DocumentUploadPage from '@/pages/merchant/DocumentUploadPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminTransactionsPage from '@/pages/admin/AdminTransactionsPage';
import AdminBusinessApprovalPage from '@/pages/admin/AdminBusinessApprovalPage'; 
import AdminPaymentProvidersPage from '@/pages/admin/AdminPaymentProvidersPage'; 
import AdminBalanceControlPage from '@/pages/admin/balance/AdminBalanceControlPage';
import AdminDepositManagementPage from '@/pages/admin/balance/AdminDepositManagementPage';
import AdminWithdrawalMonitoringPage from '@/pages/admin/balance/AdminWithdrawalMonitoringPage';
import AdminRemittanceControlPage from '@/pages/admin/balance/AdminRemittanceControlPage';
import AdminCurrencyLiquidityPage from '@/pages/admin/balance/AdminCurrencyLiquidityPage';
import AdminComplianceRiskPage from '@/pages/admin/balance/AdminComplianceRiskPage';
import AdminAnalyticsReportingPage from '@/pages/admin/balance/AdminAnalyticsReportingPage';

// Contexts
import { AuthProvider } from '@/context/AuthContext';
import { MerchantProvider } from '@/context/MerchantContext.jsx';
import { UserProvider } from '@/context/UserContext.jsx';
import { DigitalBalanceProvider } from '@/context/DigitalBalanceContext.jsx';
import { AdminProvider } from '@/context/AdminContext.jsx';
import { OmaraAIChatProvider } from '@/context/OmaraAIChatContext';
import { BusinessProvider } from '@/context/BusinessContext';
import { PaymentProviderProvider } from '@/context/PaymentProviderContext';

// Wrappers
const AdminRoutesWrapper = () => (
    <ProtectedAdminRoute>
        <AdminLayout />
    </ProtectedAdminRoute>
);

const UserWalletWrapper = () => (
    <ChainSelectionGuard>
        <UserWalletLayout />
    </ChainSelectionGuard>
);

const MerchantWrapper = () => (
    <ProtectedRoute>
        <MerchantLayout />
    </ProtectedRoute>
);

function App() {
  return (
    <Router>
      <ComposeProviders
        components={[
          AuthProvider,
          BusinessProvider, // Init Business Early
          UserProvider,
          AdminProvider,
          DigitalBalanceProvider,
          MerchantProvider,
          PaymentProviderProvider
        ]}
      >
        <CookieConsentBanner />
        
        {/* Global AI Assistant - Visible on all authorized pages */}
        <OmaraAIFixed />

        <Routes>
            {/* --- Primary Entry Point --- */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* --- Public Authentication Routes --- */}
            <Route path="/login" element={<LoginPortalPage portalType="user" />} />
            <Route path="/register" element={<LoginPortalPage portalType="register" />} />
            <Route path="/admin/login" element={<LoginPortalPage portalType="admin" />} />

            {/* --- Chain Selection --- */}
            <Route path="/chain-selection" element={
                <ProtectedRoute>
                    <ChainSelectionPage />
                </ProtectedRoute>
            } />

            {/* --- Business Registration (PUBLIC/LOCAL) --- */}
            <Route path="/business/register" element={<BusinessRegistrationPage />} />

            {/* --- User Wallet Routes --- */}
            <Route path="/dashboard" element={<Navigate to="/wallet" replace />} />
            
            <Route element={<UserWalletWrapper />}>
                <Route path="/wallet" element={<UserDashboardPage defaultTab="overview" />} />
                <Route path="/wallet/deposit" element={<UserDashboardPage defaultTab="deposit" />} />
                <Route path="/wallet/withdraw" element={<UserDashboardPage defaultTab="withdraw" />} />
                <Route path="/wallet/send" element={<UserDashboardPage defaultTab="send" />} />
                <Route path="/wallet/receive" element={<UserDashboardPage defaultTab="receive" />} />
            </Route>

            {/* --- Merchant Routes --- */}
            <Route element={<MerchantWrapper />}>
                <Route path="/merchant/dashboard" element={<MerchantDashboardPage />} />
                <Route path="/merchant/transactions" element={<TransactionsPage />} />
                <Route path="/merchant/payouts" element={<PayoutsPage />} />
                <Route path="/merchant/reports" element={<ReportsPage />} />
                <Route path="/merchant/settings" element={<SettingsPage />} />
                <Route path="/merchant/customers" element={<CustomersPage />} />
                <Route path="/merchant/invoices" element={<InvoicesPage />} />
                <Route path="/merchant/products" element={<ProductsPage />} />
                <Route path="/merchant/analytics" element={<AnalyticsPage />} />
                <Route path="/merchant/documents" element={<DocumentUploadPage />} />
                {/* Fallback for AI Assistant if needed inside merchant layout */}
                <Route path="/merchant/ai-assistant" element={<div>AI Assistant</div>} />
            </Route>

            {/* --- Admin Routes --- */}
            <Route element={<AdminRoutesWrapper />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
                <Route path="/admin/balance-control" element={<AdminBalanceControlPage />} />
                <Route path="/admin/deposits" element={<AdminDepositManagementPage />} />
                <Route path="/admin/withdrawals" element={<AdminWithdrawalMonitoringPage />} />
                <Route path="/admin/remittance" element={<AdminRemittanceControlPage />} />
                <Route path="/admin/currency-liquidity" element={<AdminCurrencyLiquidityPage />} />
                <Route path="/admin/compliance" element={<AdminComplianceRiskPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsReportingPage />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/approvals" element={<AdminBusinessApprovalPage />} />
                <Route path="/admin/payment-providers" element={<AdminPaymentProvidersPage />} />
            </Route>

            {/* --- Catch-All Route --- */}
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
        <Toaster />
      </ComposeProviders>
    </Router>
  );
}

export default App;