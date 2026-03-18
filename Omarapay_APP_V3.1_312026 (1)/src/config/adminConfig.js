import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Globe,
  Droplets,
  ShieldAlert,
  BarChart3,
  Settings,
  LayoutDashboard,
  CheckSquare,
  CreditCard,
  Coins,
  Receipt
} from 'lucide-react';

// ==============================================================================
// SENSITIVE CONFIGURATION - ADMIN WHITELIST
// ==============================================================================
// This configuration file defines the strict whitelist for Super Admin access.
// ONLY wallets listed here will be granted access to /admin/* routes.
// 
// PRIMARY ADMIN WALLET: 0xf256DE1D126061166c24905a91F7312c84623C60
// ==============================================================================

export const ADMIN_WALLET_ADDRESS = '0xf256DE1D126061166c24905a91F7312c84623C60';

export const ADMIN_WALLETS = [
  // ADMIN_WALLET_ADDRESS,
  '0xbc048634fCbB6E0c4Db3FFd9B3487B94508BBd65',
  // Future admin wallets can be appended here securely
];

/**
 * Verifies if a given address is in the admin whitelist.
 * Case-insensitive comparison.
 * @param {string} address 
 * @returns {boolean}
 */
export const isAdminWallet = (address) => {
  if (!address) return false;
  return ADMIN_WALLETS.some(admin => admin.toLowerCase() === address.toLowerCase());
};

// Legacy support alias
export const SUPER_ADMIN_WHITELIST = ADMIN_WALLETS;
export const isAuthorizedAdmin = isAdminWallet;

// Admin Menu Navigation Structure
export const adminMenuStructure = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Business Approvals', path: '/admin/approvals', icon: CheckSquare } // Added
    ]
  },
  {
    title: 'Financial Controls',
    items: [
      { name: 'Balance Management', path: '/admin/balance-control', icon: Wallet },
      { name: 'Payment Providers', path: '/admin/payment-providers', icon: CreditCard }, // Added
      { name: 'Deposit Management', path: '/admin/deposits', icon: ArrowDownLeft },
      { name: 'Withdrawal Monitoring', path: '/admin/withdrawals', icon: ArrowUpRight },
      { name: 'Remittance & Partners', path: '/admin/remittance', icon: Globe },
      { name: 'Liquidity Management', path: '/admin/currency-liquidity', icon: Droplets },
    ]
  },
  {
    title: 'Risk & Analytics',
    items: [
      { name: 'Compliance & Risk', path: '/admin/compliance', icon: ShieldAlert },
      { name: 'Analytics & Reporting', path: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Crypto POS',
    items: [
      { name: 'POS Coins', path: '/admin/pos-coins', icon: Coins },
      { name: 'POS Payments', path: '/admin/pos-payments', icon: Receipt },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings & Admins', path: '/admin/settings', icon: Settings },
    ]
  }
];