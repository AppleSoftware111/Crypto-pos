const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database');

function getAccessSecret() {
    return process.env.JWT_ACCESS_SECRET || 'change-me-access-secret';
}

function requireUserAuth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const payload = jwt.verify(token, getAccessSecret());
        const db = getDatabase();
        const user = db.getUserById(payload.sub);
        if (!user || user.status !== 'active') {
            return res.status(401).json({ error: 'Invalid token user' });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role || 'user',
            provider: user.provider || 'email',
            name: user.name || '',
        };
        return next();
    } catch (_err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { requireUserAuth };
