import { v4 as uuidv4 } from 'uuid';

export const demoTransactions = Array(25).fill(0).map((_, i) => ({
    id: `TXN-DEMO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    type: ['Payment', 'Refund', 'Payout'][Math.floor(Math.random() * 3)],
    amount: (Math.random() * 1000).toFixed(2),
    currency: 'USD',
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    customer: `Demo Customer ${i + 1}`,
    method: ['Card', 'Crypto', 'Wallet'][Math.floor(Math.random() * 3)],
    network: ['Visa', 'Ethereum', 'GCash'][Math.floor(Math.random() * 3)],
    isDemo: true
}));

export const demoPayouts = Array(12).fill(0).map((_, i) => ({
    id: `PO-DEMO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    amount: (Math.random() * 5000).toFixed(2),
    currency: 'USD',
    status: ['Completed', 'Processing', 'Failed'][Math.floor(Math.random() * 3)],
    method: 'Bank Transfer',
    destination: '**** 5678',
    isDemo: true
}));

export const demoCustomers = Array(20).fill(0).map((_, i) => ({
    id: `CUST-DEMO-${i + 1}`,
    name: `Demo User ${i + 1}`,
    email: `demo.user${i + 1}@example.com`,
    phone: `+1555000${String(i).padStart(4, '0')}`,
    totalTransactions: Math.floor(Math.random() * 50),
    totalSpent: (Math.random() * 5000).toFixed(2),
    lastTransaction: new Date().toISOString(),
    status: 'Active',
    isDemo: true
}));

export const demoInvoices = Array(15).fill(0).map((_, i) => ({
    id: `INV-DEMO-2025-${String(i + 1).padStart(3, '0')}`,
    customerName: `Demo User ${i + 1}`,
    amount: (Math.random() * 1000).toFixed(2),
    dateIssued: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    status: ['Paid', 'Unpaid', 'Overdue'][Math.floor(Math.random() * 3)],
    isDemo: true
}));

export const demoProducts = Array(10).fill(0).map((_, i) => ({
    id: `PROD-DEMO-${i + 1}`,
    name: `Demo Product ${i + 1}`,
    description: `This is a demonstration product ${i + 1}`,
    price: (Math.random() * 100).toFixed(2),
    currency: 'USD',
    status: 'Active',
    totalSold: Math.floor(Math.random() * 500),
    isDemo: true
}));

export const demoAnalytics = {
    revenue: { total: 250000, trend: 15.5 },
    transactions: { total: 2450, trend: 8.2 },
    customers: { total: 1250, trend: 12.4 },
    conversionRate: 4.5,
    chartData: Array(12).fill(0).map((_, i) => ({
        name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        revenue: Math.floor(Math.random() * 50000) + 20000,
        transactions: Math.floor(Math.random() * 500) + 100
    }))
};