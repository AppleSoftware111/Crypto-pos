export const demoWalkthroughSteps = [
    {
        id: 'welcome',
        title: 'Welcome to Omara Merchant Demo',
        description: 'Experience the full power of our merchant platform in this interactive sandbox environment. No real money is moved, so feel free to explore!',
        targetSelector: 'body', // General welcome, center screen
        position: 'center',
        highlights: [
            'Risk-free environment',
            'Pre-loaded test data',
            'Full feature access'
        ]
    },
    {
        id: 'mode-banner',
        title: 'Environment Indicator',
        description: 'Always know which environment you are working in. The blue banner indicates Demo Mode. Switch to Live Mode when you are ready to accept real payments.',
        targetSelector: '[data-tour="mode-banner"]',
        position: 'bottom',
        highlights: [
            'Blue = Demo Mode',
            'Red = Live Mode',
            'Toggle anytime'
        ]
    },
    {
        id: 'dashboard-stats',
        title: 'Business at a Glance',
        description: 'Your dashboard provides real-time insights into your revenue, transaction volume, and active customer base.',
        targetSelector: '[data-tour="dashboard-stats"]',
        position: 'bottom',
        highlights: [
            'Total Revenue',
            'Transaction Volume',
            'Active Customers'
        ]
    },
    {
        id: 'transactions-nav',
        title: 'Transaction Management',
        description: 'View, filter, and export all your payment history. In Demo Mode, you can see simulated transactions to understand the data structure.',
        targetSelector: '[data-tour="nav-transactions"]',
        position: 'right',
        highlights: [
            'Detailed history',
            'Advanced filtering',
            'Export capabilities'
        ]
    },
    {
        id: 'payouts-nav',
        title: 'Manage Payouts',
        description: 'Request withdrawals to your bank account or crypto wallet. Test the payout flow here without moving actual funds.',
        targetSelector: '[data-tour="nav-payouts"]',
        position: 'right',
        highlights: [
            'Bank transfers',
            'Crypto withdrawals',
            'Status tracking'
        ]
    },
    {
        id: 'products-nav',
        title: 'Product Catalog',
        description: 'Manage your products and services. Create items to generate payment links or use in your point-of-sale integration.',
        targetSelector: '[data-tour="nav-products"]',
        position: 'right',
        highlights: [
            'Inventory management',
            'Pricing controls',
            'Quick edits'
        ]
    },
    {
        id: 'quick-actions',
        title: 'Quick Actions',
        description: 'Fast access to common tasks like requesting payouts, viewing reports, or updating settings.',
        targetSelector: '[data-tour="quick-actions"]',
        position: 'left',
        highlights: [
            'One-click access',
            'Common tasks',
            'Efficiency tools'
        ]
    },
    {
        id: 'ai-assistant',
        title: 'Omara AI Assistant',
        description: 'Need help? Click the Omara AI button at the bottom right anytime to ask questions about features, troubleshooting, or business insights.',
        targetSelector: '[data-tour="omara-ai-trigger"]',
        position: 'top-left',
        highlights: [
            '24/7 Support',
            'Context-aware help',
            'Instant answers'
        ]
    }
];