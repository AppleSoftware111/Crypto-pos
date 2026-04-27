const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const CURRENT_SCHEMA_VERSION = 1;

/**
 * Open SQLite (file or :memory:). Sets WAL, foreign_keys, busy_timeout and applies migrations.
 * @param {{ filename?: string, memory?: boolean }} opts
 */
function openDatabase(opts = {}) {
    const memory = Boolean(opts.memory);
    const filename = memory ? ':memory:' : opts.filename;
    if (!memory && !filename) {
        throw new Error('openDatabase: filename required unless memory is true');
    }
    if (!memory) {
        const dir = path.dirname(filename);
        if (dir && dir !== '.' && !fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    const db = new Database(filename);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');

    runMigrations(db);
    return db;
}

function runMigrations(db) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY,
            applied_at TEXT NOT NULL
        );
    `);

    const applied = new Set(
        db.prepare('SELECT version FROM schema_migrations').all().map((r) => r.version)
    );

    if (!applied.has(1)) {
        db.transaction(() => {
            db.exec(`
                CREATE TABLE IF NOT EXISTS coins (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    symbol TEXT,
                    enabled INTEGER NOT NULL DEFAULT 1,
                    network TEXT,
                    wallet_address TEXT,
                    api_url TEXT,
                    api_key TEXT,
                    contract_address TEXT,
                    confirmations_required INTEGER NOT NULL DEFAULT 1,
                    icon TEXT,
                    decimals INTEGER NOT NULL DEFAULT 18,
                    method_code TEXT,
                    created_at TEXT,
                    updated_at TEXT
                );

                CREATE TABLE IF NOT EXISTS admin_users (
                    id INTEGER PRIMARY KEY,
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    created_at TEXT,
                    last_login TEXT
                );

                CREATE TABLE IF NOT EXISTS companies (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'active',
                    created_at TEXT,
                    last_login TEXT,
                    settlement_addresses TEXT NOT NULL DEFAULT '{}'
                );

                CREATE TABLE IF NOT EXISTS cashiers (
                    id TEXT PRIMARY KEY,
                    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
                    name TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'active',
                    created_at TEXT,
                    last_login TEXT
                );

                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    email TEXT NOT NULL,
                    password_hash TEXT,
                    name TEXT,
                    role TEXT,
                    provider TEXT,
                    google_id TEXT,
                    email_verified INTEGER NOT NULL DEFAULT 0,
                    status TEXT,
                    created_at TEXT,
                    updated_at TEXT,
                    last_login TEXT
                );

                CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (lower(email));
                CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users (google_id) WHERE google_id IS NOT NULL AND google_id != '';

                CREATE TABLE IF NOT EXISTS refresh_tokens (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    token_hash TEXT NOT NULL,
                    expires_at TEXT,
                    created_at TEXT,
                    revoked_at TEXT,
                    revoked_reason TEXT,
                    replaced_by_token_id TEXT,
                    user_agent TEXT,
                    ip_address TEXT
                );

                CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens (user_id);
                CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens (token_hash);

                CREATE TABLE IF NOT EXISTS user_pos_links (
                    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                    company_id TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS payments (
                    id TEXT PRIMARY KEY,
                    payment_id TEXT NOT NULL UNIQUE,
                    coin_id TEXT,
                    method TEXT,
                    amount REAL,
                    address TEXT,
                    status TEXT,
                    confirmed INTEGER NOT NULL DEFAULT 0,
                    tx_hash TEXT,
                    created_at TEXT,
                    confirmed_at TEXT,
                    company_id TEXT,
                    cashier_id TEXT,
                    phone_number TEXT,
                    security_code TEXT,
                    usd_amount REAL,
                    rate TEXT
                );

                CREATE INDEX IF NOT EXISTS idx_payments_created ON payments (created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);
                CREATE INDEX IF NOT EXISTS idx_payments_method ON payments (method);
                CREATE INDEX IF NOT EXISTS idx_payments_company ON payments (company_id);

                CREATE TABLE IF NOT EXISTS admin_logs (
                    id INTEGER PRIMARY KEY,
                    admin_id INTEGER NOT NULL,
                    action TEXT NOT NULL,
                    details TEXT,
                    ip_address TEXT,
                    created_at TEXT NOT NULL
                );

                CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs (created_at DESC);

                CREATE TABLE IF NOT EXISTS meta (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                );

                CREATE INDEX IF NOT EXISTS idx_cashiers_company ON cashiers (company_id);
            `);

            db.prepare(
                'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)'
            ).run(1, new Date().toISOString());
        })();
    }
}

module.exports = {
    openDatabase,
    runMigrations,
    CURRENT_SCHEMA_VERSION,
};
