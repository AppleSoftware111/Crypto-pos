/**
 * Determines the current context based on the URL path.
 * Used to tailor Omara AI responses and suggested questions.
 */
export const getContextFromPath = (pathname) => {
    if (!pathname) return 'general';

    if (pathname.includes('/merchant/dashboard')) return 'dashboard';
    if (pathname.includes('/merchant/transactions')) return 'transactions';
    if (pathname.includes('/merchant/payouts')) return 'payouts';
    if (pathname.includes('/merchant/reports')) return 'reports';
    if (pathname.includes('/merchant/customers')) return 'customers';
    if (pathname.includes('/merchant/products')) return 'products';
    if (pathname.includes('/merchant/invoices')) return 'invoices';
    if (pathname.includes('/merchant/settings')) return 'settings';
    if (pathname.includes('/wallet')) return 'wallet';
    if (pathname.includes('/login') || pathname.includes('/register')) return 'auth';
    
    return 'general';
};

export const getContextLabel = (context) => {
    const labels = {
        'dashboard': 'Merchant Dashboard',
        'transactions': 'Transaction Management',
        'payouts': 'Payouts & Withdrawals',
        'reports': 'Business Reports',
        'customers': 'Customer Management',
        'products': 'Product Catalog',
        'invoices': 'Invoicing',
        'settings': 'Account Settings',
        'wallet': 'Personal Wallet',
        'auth': 'Authentication',
        'general': 'General'
    };
    return labels[context] || 'General';
};