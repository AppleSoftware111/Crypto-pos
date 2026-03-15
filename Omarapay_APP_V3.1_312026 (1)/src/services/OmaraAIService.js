/**
 * OmaraAIService.js
 * Service for handling interactions with Claude API (or simulated backend) for Omara AI Assistant.
 * 
 * NOTE: In a production environment, API keys should NEVER be exposed on the client side.
 * This service should ideally call a secure backend endpoint which then communicates with Anthropic/Claude.
 * For this implementation, we will simulate the integration structure.
 */

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// In-memory rate limiting store (per session/refresh)
const requestLog = [];

/**
 * Checks if the current user is rate limited.
 * @returns {boolean} True if rate limited, false otherwise.
 */
const checkRateLimit = () => {
  const now = Date.now();
  // Remove requests older than the window
  while (requestLog.length > 0 && requestLog[0] < now - RATE_LIMIT_WINDOW) {
    requestLog.shift();
  }
  
  if (requestLog.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  requestLog.push(now);
  return false;
};

/**
 * Sends a message to the Omara AI Assistant.
 * @param {string} message - The user's query.
 * @param {Array} history - Previous chat history for context.
 * @param {string} walletAddress - The merchant's wallet address for logging.
 * @returns {Promise<string>} The AI's response.
 */
export const sendMessageToOmaraAI = async (message, history, walletAddress) => {
  if (!message || !message.trim()) {
    throw new Error("Message cannot be empty.");
  }

  if (checkRateLimit()) {
    throw new Error("Rate limit exceeded. Please wait a moment before sending more messages.");
  }

  // LOGGING (Audit Trail)
  console.log(`[Omara AI Audit] User: ${walletAddress} | Timestamp: ${new Date().toISOString()} | Action: Query Sent`);

  // SIMULATED RESPONSE LOGIC
  // In a real implementation, this would be:
  // const response = await fetch('/api/omara-ai/chat', { ... });
  
  // Artificial delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Determine response based on keywords (Mock Logic for Demo)
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes("compliance") || lowerMsg.includes("kyc")) {
    return `### Compliance & KYC Assistance
    
As a regulated payment processor, **Omara** ensures strict adherence to global standards.

1.  **KYC Requirements**: For Tier 2 merchants, we require:
    *   Valid Government ID
    *   Proof of Business Address
    *   Certificate of Incorporation

2.  **AML Monitoring**: All transactions over $10,000 are automatically flagged for AML review.
    
*Need to upload documents? Go to the [Compliance Section](/merchant/compliance).*`;
  }

  if (lowerMsg.includes("payout") || lowerMsg.includes("settlement") || lowerMsg.includes("withdraw")) {
    return `### Settlements & Payouts

**Current Settlement Status:**
*   **Standard Settlement**: T+1 (Next Business Day)
*   **Crypto Payouts**: Instant (Network confirmation dependent)

To initiate a withdrawal, navigate to the **Wallet** tab and select 'Withdraw'. You can choose between:
*   Local Bank Transfer
*   USDT (TRC20/ERC20)
*   Bitcoin (BTC)

*Is there a specific transaction you are looking for?*`;
  }
  
  if (lowerMsg.includes("integration") || lowerMsg.includes("api") || lowerMsg.includes("technical")) {
    return `### Technical Support

**Omara API Documentation** is available in your developer portal.

*   **API Keys**: You can manage your keys in *Settings > Integrations*.
*   **Webhooks**: Configure endpoints to receive real-time transaction updates.
*   **Sandbox**: Use our testnet environment to validate your integration before going live.

If you are facing a specific error code (e.g., \`ERR_402\`), please share it here for immediate debugging.`;
  }

  // Default Fallback Response
  return `I'm **Omara AI**, your business assistant. I can help you with:

*   **Payment Processing**: Rates, methods, and dispute resolution.
*   **Compliance**: KYC status, AML checks, and document verification.
*   **Technical Integration**: API docs, plugins, and troubleshooting.
*   **Growth**: Analytics, reporting, and expansion strategies.

*How can I assist your business today?*`;
};