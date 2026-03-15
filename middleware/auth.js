// Authentication middleware for admin routes

function requireAuth(req, res, next) {
    // Session (browser admin panel)
    if (req.session && req.session.adminId) {
        return next();
    }
    // API key (Omarapay backend or server-to-server)
    const apiKey = req.headers['x-api-key'];
    if (apiKey && process.env.ADMIN_API_KEY && apiKey === process.env.ADMIN_API_KEY) {
        return next();
    }

    res.status(401).json({ error: 'Authentication required' });
}

function requireAuthHTML(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }

    res.redirect('/admin/login');
}

module.exports = { requireAuth, requireAuthHTML };

