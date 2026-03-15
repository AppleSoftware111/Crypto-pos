import { getContextFromPath } from './OmaraAIContextService';

/**
 * Mock AI Service to generate responses based on context and keywords.
 * In a real app, this would call an LLM API.
 */
export const generateAIResponse = async (query, pathname) => {
    const context = getContextFromPath(pathname);
    const lowercaseQuery = query.toLowerCase();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Demo Mode Specifics
    if (lowercaseQuery.includes('demo') || lowercaseQuery.includes('live')) {
        return {
            text: "Omara features two environments: Demo (Sandbox) and Live. You can toggle between them using the switch in the top navigation bar. Demo mode allows you to test features without using real money, while Live mode processes actual transactions.",
            actions: [{ label: "Switch Environment", link: "/merchant/settings" }]
        };
    }

    // Payouts
    if (lowercaseQuery.includes('payout') || lowercaseQuery.includes('withdraw')) {
        return {
            text: "To request a payout, navigate to the Payouts page. You can withdraw funds to a connected bank account or crypto wallet. In Demo mode, this process is simulated instantly.",
            actions: [{ label: "Go to Payouts", link: "/merchant/payouts" }]
        };
    }

    // Transactions
    if (lowercaseQuery.includes('transaction') || lowercaseQuery.includes('payment')) {
        return {
            text: "You can view all your payment history on the Transactions page. Use the filters to sort by status, date, or amount. You can also export this data to CSV for accounting purposes.",
            actions: [{ label: "View Transactions", link: "/merchant/transactions" }]
        };
    }

    // Products
    if (lowercaseQuery.includes('product') || lowercaseQuery.includes('item') || lowercaseQuery.includes('sell')) {
        return {
            text: "Manage your inventory in the Products section. You can add new items, set prices, and track sales performance for individual products.",
            actions: [{ label: "Manage Products", link: "/merchant/products" }]
        };
    }

    // Context-Aware Fallbacks
    switch (context) {
        case 'dashboard':
            return { text: "Your Dashboard gives you a quick overview of your business health. You can see real-time revenue, recent transactions, and quick links to common actions." };
        case 'reports':
            return { text: "The Reports section provides deep analytics. You can view revenue trends, customer growth, and transaction volume over time." };
        case 'customers':
            return { text: "Here you can manage your customer database. View purchase history, contact details, and lifetime value for each client." };
        case 'settings':
            return { text: "In Settings, you can configure your business profile, notification preferences, security options (2FA), and manage your API keys." };
        default:
            return { text: "I can help you navigate the Omara platform. Try asking about 'payouts', 'transactions', or 'products'. You can also ask about the difference between Demo and Live modes." };
    }
};