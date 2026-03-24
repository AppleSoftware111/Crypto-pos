const express = require('express');
const bcrypt = require('bcrypt');
const { getDatabase } = require('../database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function validatePasswordPolicy(password) {
    const text = String(password || '');
    if (text.length < 8) {
        return 'Password must be at least 8 characters.';
    }
    if (!/[A-Z]/.test(text) || !/[a-z]/.test(text) || !/\d/.test(text)) {
        return 'Password must include uppercase, lowercase, and a number.';
    }
    return null;
}

function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
}

function sanitizeUser(u) {
    if (!u) return null;
    return {
        id: u.id,
        email: u.email,
        name: u.name || '',
        role: u.role || 'user',
        provider: u.provider || 'email',
        hasGoogleLink: Boolean(u.google_id),
        email_verified: Boolean(u.email_verified),
        status: u.status || 'active',
        created_at: u.created_at,
        updated_at: u.updated_at,
        last_login: u.last_login || null,
    };
}

const ALLOWED_ROLES = new Set(['user', 'admin']);

router.use(requireAuth);

router.get('/users', (req, res) => {
    try {
        const db = getDatabase();
        const { search, role, provider, status, limit, offset } = req.query;
        const { users, total } = db.listUsers({
            search,
            role,
            provider,
            status,
            limit,
            offset,
        });
        res.json({
            users: users.map(sanitizeUser),
            total,
            limit: Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500),
            offset: Math.max(parseInt(offset, 10) || 0, 0),
        });
    } catch (error) {
        console.error('Admin list users error:', error);
        res.status(500).json({ error: 'Failed to list users' });
    }
});

router.get('/users/:id', (req, res) => {
    try {
        const db = getDatabase();
        const user = db.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user: sanitizeUser(user) });
    } catch (error) {
        console.error('Admin get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

router.post('/users', (req, res) => {
    try {
        const db = getDatabase();
        const email = normalizeEmail(req.body?.email);
        const password = String(req.body?.password || '');
        const name = String(req.body?.name || '').trim();
        const roleRaw = String(req.body?.role || 'user').toLowerCase();

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        const pwdErr = validatePasswordPolicy(password);
        if (pwdErr) {
            return res.status(400).json({ error: pwdErr });
        }
        if (!ALLOWED_ROLES.has(roleRaw)) {
            return res.status(400).json({ error: 'Invalid role.' });
        }
        if (db.getUserByEmail(email)) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        const passwordHash = bcrypt.hashSync(password, 12);
        const user = db.createUser({
            email,
            password_hash: passwordHash,
            name: name || email.split('@')[0],
            provider: 'email',
            role: roleRaw,
            email_verified: Boolean(req.body?.email_verified),
            status: 'active',
        });

        if (req.session?.adminId) {
            db.logAdminAction(req.session.adminId, 'ADMIN_CREATE_USER', { userId: user.id, email }, req.ip);
        }

        res.status(201).json({ user: sanitizeUser(user) });
    } catch (error) {
        console.error('Admin create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.patch('/users/:id', (req, res) => {
    try {
        const db = getDatabase();
        const user = db.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updates = {};
        if (req.body.name !== undefined) {
            updates.name = String(req.body.name || '').trim();
        }
        if (req.body.role !== undefined) {
            const r = String(req.body.role || '').toLowerCase();
            if (!ALLOWED_ROLES.has(r)) {
                return res.status(400).json({ error: 'Invalid role.' });
            }
            updates.role = r;
        }
        if (req.body.status !== undefined) {
            const s = String(req.body.status || '').toLowerCase();
            if (!['active', 'inactive', 'suspended'].includes(s)) {
                return res.status(400).json({ error: 'Invalid status.' });
            }
            updates.status = s;
        }
        if (req.body.email_verified !== undefined) {
            updates.email_verified = Boolean(req.body.email_verified);
        }
        if (req.body.email !== undefined) {
            const nextEmail = normalizeEmail(req.body.email);
            if (!nextEmail) {
                return res.status(400).json({ error: 'Invalid email.' });
            }
            const other = db.getUserByEmail(nextEmail);
            if (other && other.id !== user.id) {
                return res.status(409).json({ error: 'Email is already in use.' });
            }
            updates.email = nextEmail;
        }
        if (req.body.password !== undefined && req.body.password !== '') {
            const pwdErr = validatePasswordPolicy(req.body.password);
            if (pwdErr) {
                return res.status(400).json({ error: pwdErr });
            }
            updates.password_hash = bcrypt.hashSync(String(req.body.password), 12);
        }

        const prevStatus = String(user.status || '').toLowerCase();
        const updated = db.updateUser(user.id, updates);
        const newStatus = String(updated.status || '').toLowerCase();

        if (prevStatus === 'active' && newStatus !== 'active') {
            db.revokeUserRefreshTokens(user.id, 'admin_status_change');
        }

        if (req.session?.adminId) {
            db.logAdminAction(req.session.adminId, 'ADMIN_UPDATE_USER', { userId: user.id, updates: Object.keys(updates) }, req.ip);
        }

        res.json({ user: sanitizeUser(updated) });
    } catch (error) {
        console.error('Admin update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/users/:id', (req, res) => {
    try {
        const db = getDatabase();
        const user = db.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        db.updateUser(user.id, { status: 'inactive' });
        db.revokeUserRefreshTokens(user.id, 'admin_delete');

        if (req.session?.adminId) {
            db.logAdminAction(req.session.adminId, 'ADMIN_SOFT_DELETE_USER', { userId: user.id }, req.ip);
        }

        res.json({ success: true, user: sanitizeUser(db.getUserById(user.id)) });
    } catch (error) {
        console.error('Admin delete user error:', error);
        res.status(500).json({ error: 'Failed to deactivate user' });
    }
});

module.exports = router;
