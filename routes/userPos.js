const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getDatabase } = require('../database');
const { requireUserAuth } = require('../middleware/userAuth');

const linkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many link attempts. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * POST /api/user/pos/link
 * Body: { companyPassword: string }
 * Links the authenticated user to the POS company that matches the password.
 */
router.post('/pos/link', requireUserAuth, linkLimiter, (req, res) => {
    try {
        const { companyPassword } = req.body;
        if (!companyPassword || String(companyPassword).length < 1) {
            return res.status(400).json({ error: 'companyPassword is required' });
        }
        const db = getDatabase();
        const company = db.authenticateCompany(companyPassword);
        if (!company) {
            return res.status(401).json({ error: 'Invalid company password' });
        }
        db.upsertUserPosLink(req.user.id, company.id);
        res.json({
            success: true,
            company: { id: company.id, name: company.name },
        });
    } catch (error) {
        console.error('user pos link error:', error);
        res.status(500).json({ error: 'Failed to link POS account' });
    }
});

/**
 * GET /api/user/pos/transactions?limit=&offset=
 * Returns payments for the user's linked POS company (JWT only).
 */
router.get('/pos/transactions', requireUserAuth, (req, res) => {
    try {
        const db = getDatabase();
        const link = db.getUserPosLink(req.user.id);
        if (!link || !link.company_id) {
            return res.status(403).json({ error: 'POS account not linked. Link your company password first.' });
        }
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
        const offset = parseInt(req.query.offset, 10) || 0;
        const payments = db.getPayments(limit, offset, { companyId: link.company_id });
        res.json({ success: true, transactions: payments });
    } catch (error) {
        console.error('user pos transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

module.exports = router;
