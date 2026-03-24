const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const { getDatabase } = require('../database');
const { requireUserAuth } = require('../middleware/userAuth');

const router = express.Router();
const googleClient = new OAuth2Client();

// Strict: only login / register / Google (credential stuffing). Does not apply to refresh or /me.
const authCredentialLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.AUTH_RATE_LIMIT_MAX ? parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) : 30,
    message: { error: 'Too many authentication attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Loose: refresh (and logout) can be called often during SPA navigation; keep a high cap to avoid 429 in dev.
const authSessionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.AUTH_SESSION_RATE_LIMIT_MAX
        ? parseInt(process.env.AUTH_SESSION_RATE_LIMIT_MAX, 10)
        : 500,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
}

function getAccessSecret() {
    return process.env.JWT_ACCESS_SECRET || 'change-me-access-secret';
}

function getRefreshSecret() {
    return process.env.JWT_REFRESH_SECRET || 'change-me-refresh-secret';
}

function getAccessTtl() {
    return process.env.JWT_ACCESS_TTL || '15m';
}

function getRefreshTtl() {
    return process.env.JWT_REFRESH_TTL || '7d';
}

function parseDurationMs(value) {
    const text = String(value || '').trim();
    const match = text.match(/^(\d+)([smhd])$/i);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const amount = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };
    return amount * (multipliers[unit] || multipliers.d);
}

function getCookieOptions() {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: parseDurationMs(getRefreshTtl()),
    };
}

function sanitizeUser(user) {
    return {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role || 'user',
        provider: user.provider || 'email',
        emailVerified: Boolean(user.email_verified),
    };
}

function signAccessToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role || 'user',
            provider: user.provider || 'email',
        },
        getAccessSecret(),
        { expiresIn: getAccessTtl() }
    );
}

function generateRefreshTokenPayload(user, tokenId) {
    return jwt.sign(
        { sub: user.id, jti: tokenId, type: 'refresh' },
        getRefreshSecret(),
        { expiresIn: getRefreshTtl() }
    );
}

function hashToken(token) {
    return crypto.createHash('sha256').update(String(token)).digest('hex');
}

function issueRefreshToken(db, user, req) {
    const tokenId = `rt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const refreshToken = generateRefreshTokenPayload(user, tokenId);
    const decoded = jwt.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000).toISOString();
    db.createRefreshToken({
        id: tokenId,
        user_id: user.id,
        token_hash: hashToken(refreshToken),
        expires_at: expiresAt,
        user_agent: req.headers['user-agent'] || null,
        ip_address: req.ip || null,
    });
    return refreshToken;
}

function sendAuthSuccess(res, db, user, refreshToken) {
    const accessToken = signAccessToken(user);
    res.cookie('omara_refresh_token', refreshToken, getCookieOptions());
    return res.json({
        success: true,
        accessToken,
        tokenType: 'Bearer',
        user: sanitizeUser(db.getUserById(user.id) || user),
    });
}

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

router.post('/register', authCredentialLimiter, (req, res) => {
    try {
        const db = getDatabase();
        const email = normalizeEmail(req.body?.email);
        const password = String(req.body?.password || '');
        const name = String(req.body?.name || '').trim();

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const passwordError = validatePasswordPolicy(password);
        if (passwordError) {
            return res.status(400).json({ error: passwordError });
        }

        const existing = db.getUserByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        const passwordHash = bcrypt.hashSync(password, 12);
        const user = db.createUser({
            email,
            password_hash: passwordHash,
            name: name || email.split('@')[0],
            provider: 'email',
            role: 'user',
            email_verified: false,
        });

        const refreshToken = issueRefreshToken(db, user, req);
        return sendAuthSuccess(res, db, user, refreshToken);
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ error: 'Registration failed.' });
    }
});

router.post('/login', authCredentialLimiter, (req, res) => {
    try {
        const db = getDatabase();
        const email = normalizeEmail(req.body?.email);
        const password = String(req.body?.password || '');

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = db.authenticateUser(email, password);
        if (!user) {
            const byEmail = db.getUserByEmail(email);
            if (byEmail && !byEmail.password_hash) {
                return res.status(400).json({ error: 'This account uses Google sign-in. Use Google to continue.' });
            }
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const refreshToken = issueRefreshToken(db, user, req);
        return sendAuthSuccess(res, db, user, refreshToken);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed.' });
    }
});

router.post('/google', authCredentialLimiter, async (req, res) => {
    try {
        const db = getDatabase();
        const idToken = String(req.body?.idToken || '');
        if (!idToken) {
            return res.status(400).json({ error: 'Google idToken is required.' });
        }

        const audience = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
        if (!audience) {
            return res.status(500).json({ error: 'Google OAuth is not configured on server.' });
        }

        const ticket = await googleClient.verifyIdToken({ idToken, audience });
        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email) {
            return res.status(401).json({ error: 'Invalid Google token payload.' });
        }

        const googleId = payload.sub;
        const email = normalizeEmail(payload.email);
        const name = String(payload.name || payload.given_name || email.split('@')[0] || 'User');
        const emailVerified = Boolean(payload.email_verified);

        let user = db.getUserByGoogleId(googleId);
        if (!user) {
            const existingByEmail = db.getUserByEmail(email);
            if (existingByEmail) {
                user = db.updateUser(existingByEmail.id, {
                    google_id: googleId,
                    provider: existingByEmail.password_hash ? 'email_google' : 'google',
                    email_verified: emailVerified || existingByEmail.email_verified,
                    name: existingByEmail.name || name,
                    last_login: new Date().toISOString(),
                });
            } else {
                user = db.createUser({
                    email,
                    password_hash: null,
                    name,
                    provider: 'google',
                    google_id: googleId,
                    role: 'user',
                    email_verified: emailVerified,
                });
                user = db.updateUser(user.id, { last_login: new Date().toISOString() });
            }
        } else {
            user = db.updateUser(user.id, {
                email,
                name: user.name || name,
                email_verified: emailVerified || user.email_verified,
                last_login: new Date().toISOString(),
            });
        }

        const refreshToken = issueRefreshToken(db, user, req);
        return sendAuthSuccess(res, db, user, refreshToken);
    } catch (error) {
        console.error('Google auth error:', error);
        return res.status(401).json({ error: 'Google authentication failed.' });
    }
});

router.post('/refresh', authSessionLimiter, (req, res) => {
    try {
        const db = getDatabase();
        const refreshToken = req.cookies?.omara_refresh_token || req.body?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token is required.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, getRefreshSecret());
        } catch (_err) {
            return res.status(401).json({ error: 'Invalid refresh token.' });
        }

        if (!decoded?.sub || !decoded?.jti) {
            return res.status(401).json({ error: 'Invalid refresh token payload.' });
        }

        const stored = db.getValidRefreshTokenByHash(hashToken(refreshToken));
        if (!stored || stored.id !== decoded.jti || stored.user_id !== decoded.sub) {
            return res.status(401).json({ error: 'Refresh token is revoked or expired.' });
        }

        const user = db.getUserById(decoded.sub);
        if (!user || user.status !== 'active') {
            return res.status(401).json({ error: 'User is not active.' });
        }

        const newRefreshToken = issueRefreshToken(db, user, req);
        const newRefreshDecoded = jwt.decode(newRefreshToken);
        db.revokeRefreshToken(stored.id, 'rotated', newRefreshDecoded.jti);

        const accessToken = signAccessToken(user);
        res.cookie('omara_refresh_token', newRefreshToken, getCookieOptions());
        return res.json({
            success: true,
            accessToken,
            tokenType: 'Bearer',
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(500).json({ error: 'Failed to refresh token.' });
    }
});

router.post('/logout', authSessionLimiter, (req, res) => {
    try {
        const db = getDatabase();
        const refreshToken = req.cookies?.omara_refresh_token || req.body?.refreshToken;
        if (refreshToken) {
            const stored = db.getValidRefreshTokenByHash(hashToken(refreshToken));
            if (stored) {
                db.revokeRefreshToken(stored.id, 'logout');
            }
        }
        res.clearCookie('omara_refresh_token', getCookieOptions());
        return res.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Logout failed.' });
    }
});

router.get('/me', requireUserAuth, (req, res) => {
    return res.json({
        success: true,
        user: req.user,
    });
});

module.exports = router;
