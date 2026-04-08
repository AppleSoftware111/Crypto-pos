const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database');
const crypto = require('crypto');

/**
 * POS Authentication Routes
 * Handles two-level authentication: Company → Cashier
 */

// Generate a simple token (in production, use JWT)
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Store active tokens (in production, use Redis or database)
const activeTokens = new Map();

// Middleware to verify company token
const verifyCompanyToken = (req, res, next) => {
    const token = req.headers['x-company-token'];
    
    if (!token) {
        return res.status(401).json({ error: 'Company token required' });
    }

    const tokenData = activeTokens.get(token);
    if (!tokenData || tokenData.type !== 'company') {
        return res.status(401).json({ error: 'Invalid company token' });
    }

    req.companyId = tokenData.companyId;
    next();
};

// Middleware to verify cashier token
const verifyCashierToken = (req, res, next) => {
    const token = req.headers['x-cashier-token'];
    
    if (!token) {
        return res.status(401).json({ error: 'Cashier token required' });
    }

    const tokenData = activeTokens.get(token);
    if (!tokenData || tokenData.type !== 'cashier') {
        return res.status(401).json({ error: 'Invalid cashier token' });
    }

    req.companyId = tokenData.companyId;
    req.cashierId = tokenData.cashierId;
    next();
};

/** Company or cashier token — for read-only endpoints (e.g. transaction list) so merchant owner does not need a separate cashier session. */
const verifyCompanyOrCashier = (req, res, next) => {
    const cashierToken = req.headers['x-cashier-token'];
    const companyToken = req.headers['x-company-token'];

    if (cashierToken) {
        const tokenData = activeTokens.get(cashierToken);
        if (tokenData && tokenData.type === 'cashier') {
            req.companyId = tokenData.companyId;
            req.cashierId = tokenData.cashierId;
            req.posAuthScope = 'cashier';
            return next();
        }
    }

    if (companyToken) {
        const tokenData = activeTokens.get(companyToken);
        if (tokenData && tokenData.type === 'company') {
            req.companyId = tokenData.companyId;
            req.posAuthScope = 'company';
            return next();
        }
    }

    return res.status(401).json({ error: 'Valid company or cashier token required' });
};

/**
 * Company Login
 * POST /api/pos/company/login
 * Body: { password: string }
 */
router.post('/company/login', (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Company password is required' });
        }

        const db = getDatabase();
        const company = db.authenticateCompany(password);

        if (!company) {
            return res.status(401).json({ error: 'Invalid company password' });
        }

        // Generate token
        const token = generateToken();
        activeTokens.set(token, {
            type: 'company',
            companyId: company.id,
            createdAt: new Date().toISOString()
        });

        // Cleanup old tokens (keep only last 1000)
        if (activeTokens.size > 1000) {
            const tokens = Array.from(activeTokens.entries());
            tokens.sort((a, b) => new Date(a[1].createdAt) - new Date(b[1].createdAt));
            tokens.slice(0, tokens.length - 1000).forEach(([token]) => {
                activeTokens.delete(token);
            });
        }

        res.json({
            success: true,
            token,
            company: {
                id: company.id,
                name: company.name,
                status: company.status
            }
        });
    } catch (error) {
        console.error('Company login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * Get Cashiers for Company
 * GET /api/pos/company/:companyId/cashiers
 * Headers: X-Company-Token
 */
router.get('/company/:companyId/cashiers', verifyCompanyToken, (req, res) => {
    try {
        const { companyId } = req.params;

        // Verify token matches company
        if (req.companyId !== companyId) {
            return res.status(403).json({ error: 'Unauthorized access to company' });
        }

        const db = getDatabase();
        const cashiers = db.getCashiersByCompany(companyId);

        // Return cashiers without password hash
        const safeCashiers = cashiers.map(c => ({
            id: c.id,
            company_id: c.company_id,
            name: c.name,
            status: c.status,
            created_at: c.created_at,
            last_login: c.last_login
        }));

        res.json({
            success: true,
            cashiers: safeCashiers
        });
    } catch (error) {
        console.error('Error fetching cashiers:', error);
        res.status(500).json({ error: 'Failed to fetch cashiers' });
    }
});

/**
 * Cashier Login
 * POST /api/pos/cashier/login
 * Body: { companyId: string, cashierId: string, password: string }
 * Headers: X-Company-Token (optional, but recommended)
 */
router.post('/cashier/login', (req, res) => {
    try {
        const { companyId, cashierId, password } = req.body;

        if (!companyId || !cashierId || !password) {
            return res.status(400).json({ 
                error: 'Company ID, Cashier ID, and password are required' 
            });
        }

        // Verify company token if provided
        const companyToken = req.headers['x-company-token'];
        if (companyToken) {
            const tokenData = activeTokens.get(companyToken);
            if (!tokenData || tokenData.companyId !== companyId) {
                return res.status(403).json({ error: 'Invalid company token' });
            }
        }

        const db = getDatabase();
        const cashier = db.authenticateCashier(companyId, cashierId, password);

        if (!cashier) {
            return res.status(401).json({ error: 'Invalid cashier credentials' });
        }

        // Generate token
        const token = generateToken();
        activeTokens.set(token, {
            type: 'cashier',
            companyId: cashier.company_id,
            cashierId: cashier.id,
            createdAt: new Date().toISOString()
        });

        res.json({
            success: true,
            token,
            cashier: {
                id: cashier.id,
                company_id: cashier.company_id,
                name: cashier.name,
                status: cashier.status
            }
        });
    } catch (error) {
        console.error('Cashier login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * Check Authentication Status
 * GET /api/pos/auth/status
 * Headers: X-Company-Token, X-Cashier-Token
 */
router.get('/auth/status', (req, res) => {
    try {
        const companyToken = req.headers['x-company-token'];
        const cashierToken = req.headers['x-cashier-token'];

        let companyValid = false;
        let cashierValid = false;

        if (companyToken) {
            const tokenData = activeTokens.get(companyToken);
            companyValid = !!tokenData && tokenData.type === 'company';
        }

        if (cashierToken) {
            const tokenData = activeTokens.get(cashierToken);
            cashierValid = !!tokenData && tokenData.type === 'cashier';
        }

        res.json({
            valid: companyValid && cashierValid,
            companyAuthenticated: companyValid,
            cashierAuthenticated: cashierValid
        });
    } catch (error) {
        console.error('Auth status check error:', error);
        res.status(500).json({ error: 'Failed to check auth status' });
    }
});

/**
 * Logout
 * POST /api/pos/logout
 * Headers: X-Company-Token, X-Cashier-Token
 */
router.post('/logout', (req, res) => {
    try {
        const companyToken = req.headers['x-company-token'];
        const cashierToken = req.headers['x-cashier-token'];

        if (companyToken) {
            activeTokens.delete(companyToken);
        }

        if (cashierToken) {
            activeTokens.delete(cashierToken);
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

/**
 * Transaction history (recent payments)
 * GET /api/pos/transactions
 * Query: limit (default 50), offset (default 0)
 * Headers: X-Company-Token and/or X-Cashier-Token (either valid token is accepted)
 */
router.get('/transactions', verifyCompanyOrCashier, (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
        const offset = parseInt(req.query.offset, 10) || 0;
        const db = getDatabase();
        const filters = req.companyId ? { companyId: req.companyId } : {};
        const payments = db.getPayments(limit, offset, filters);

        res.json({
            success: true,
            transactions: payments,
        });
    } catch (error) {
        console.error('Transactions list error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

/** Optional POS session from headers (for payment create on same server). Not a route handler. */
function tryGetCompanyIdFromRequest(req) {
    const cashierToken = req.headers['x-cashier-token'];
    const companyToken = req.headers['x-company-token'];
    if (cashierToken) {
        const tokenData = activeTokens.get(cashierToken);
        if (tokenData && tokenData.type === 'cashier') {
            return { companyId: tokenData.companyId, cashierId: tokenData.cashierId };
        }
    }
    if (companyToken) {
        const tokenData = activeTokens.get(companyToken);
        if (tokenData && tokenData.type === 'company') {
            return { companyId: tokenData.companyId, cashierId: null };
        }
    }
    return null;
}

router.tryGetCompanyIdFromRequest = tryGetCompanyIdFromRequest;

module.exports = router;
