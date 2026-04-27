#!/usr/bin/env node
/**
 * One-time import: legacy data.json document store -> SQLite (better-sqlite3).
 *
 * Usage:
 *   node scripts/import-json-to-sqlite.js --dry-run
 *   node scripts/import-json-to-sqlite.js --backup --confirm
 *   node scripts/import-json-to-sqlite.js --confirm --force   # wipe app tables first
 *
 * Env:
 *   DATA_JSON_PATH  (default: ./data.json next to repo root / cwd)
 *   SQLITE_PATH     (default: ./data/crypto-pos.db under repo root)
 */

const fs = require('fs');
const path = require('path');
const { openDatabase } = require('../sqliteDb');

const COLLECTIONS = [
    'coins',
    'admin_users',
    'companies',
    'cashiers',
    'users',
    'refresh_tokens',
    'user_pos_links',
    'payments',
    'admin_logs',
];

function parseArgs(argv) {
    const flags = new Set();
    for (const a of argv) {
        if (a.startsWith('--')) flags.add(a.slice(2));
    }
    return {
        dryRun: flags.has('dry-run'),
        backup: flags.has('backup'),
        confirm: flags.has('confirm'),
        force: flags.has('force'),
    };
}

function defaultJsonPath() {
    if (process.env.DATA_JSON_PATH) {
        return path.resolve(process.env.DATA_JSON_PATH);
    }
    return path.join(__dirname, '..', 'data.json');
}

function defaultSqlitePath() {
    if (process.env.SQLITE_PATH) {
        return path.resolve(process.env.SQLITE_PATH);
    }
    return path.join(__dirname, '..', 'data', 'crypto-pos.db');
}

function readJsonDocument(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') {
        throw new Error('Root JSON must be an object');
    }
    return data;
}

function countReport(data) {
    const report = {};
    for (const key of COLLECTIONS) {
        const arr = data[key];
        report[key] = Array.isArray(arr) ? arr.length : 0;
    }
    if (data._meta && typeof data._meta === 'object') {
        report._meta_keys = Object.keys(data._meta).length;
    }
    return report;
}

function wipeAppTables(db) {
    const tables = [
        'payments',
        'admin_logs',
        'refresh_tokens',
        'user_pos_links',
        'cashiers',
        'companies',
        'users',
        'admin_users',
        'coins',
        'meta',
    ];
    db.exec('PRAGMA foreign_keys = OFF');
    for (const t of tables) {
        db.exec(`DELETE FROM ${t}`);
    }
    db.exec('PRAGMA foreign_keys = ON');
}

function rowCount(db, table) {
    return db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n;
}

function importAll(db, data) {
    const now = new Date().toISOString();

    const insCoin = db.prepare(
        `INSERT INTO coins (
            id, name, symbol, enabled, network, wallet_address, api_url, api_key,
            contract_address, confirmations_required, icon, decimals, method_code, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const c of data.coins || []) {
        insCoin.run(
            c.id,
            c.name,
            c.symbol,
            c.enabled !== undefined ? c.enabled : 1,
            c.network || 'mainnet',
            c.wallet_address ?? null,
            c.api_url ?? null,
            c.api_key ?? null,
            c.contract_address ?? null,
            c.confirmations_required ?? 1,
            c.icon ?? null,
            c.decimals ?? 18,
            c.method_code ?? null,
            c.created_at || now,
            c.updated_at || now
        );
    }

    const insAdmin = db.prepare(
        `INSERT INTO admin_users (id, username, password_hash, created_at, last_login)
         VALUES (?, ?, ?, ?, ?)`
    );
    for (const u of data.admin_users || []) {
        insAdmin.run(
            u.id,
            u.username,
            u.password_hash,
            u.created_at || now,
            u.last_login ?? null
        );
    }

    const insCo = db.prepare(
        `INSERT INTO companies (id, name, password_hash, status, created_at, last_login, settlement_addresses)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    for (const c of data.companies || []) {
        const sa =
            c.settlement_addresses && typeof c.settlement_addresses === 'object'
                ? JSON.stringify(c.settlement_addresses)
                : '{}';
        insCo.run(
            c.id,
            c.name,
            c.password_hash,
            c.status || 'active',
            c.created_at || now,
            c.last_login ?? null,
            sa
        );
    }

    const insCashier = db.prepare(
        `INSERT INTO cashiers (id, company_id, name, password_hash, status, created_at, last_login)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    for (const c of data.cashiers || []) {
        insCashier.run(
            c.id,
            c.company_id,
            c.name,
            c.password_hash,
            c.status || 'active',
            c.created_at || now,
            c.last_login ?? null
        );
    }

    const insUser = db.prepare(
        `INSERT INTO users (
            id, email, password_hash, name, role, provider, google_id,
            email_verified, status, created_at, updated_at, last_login
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const u of data.users || []) {
        insUser.run(
            u.id,
            String(u.email || '').trim().toLowerCase(),
            u.password_hash ?? null,
            u.name ?? '',
            u.role || 'user',
            u.provider || 'email',
            u.google_id ?? null,
            u.email_verified ? 1 : 0,
            u.status || 'active',
            u.created_at || now,
            u.updated_at || now,
            u.last_login ?? null
        );
    }

    const insRt = db.prepare(
        `INSERT INTO refresh_tokens (
            id, user_id, token_hash, expires_at, created_at, revoked_at, revoked_reason,
            replaced_by_token_id, user_agent, ip_address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const t of data.refresh_tokens || []) {
        insRt.run(
            t.id,
            t.user_id,
            t.token_hash,
            t.expires_at ?? null,
            t.created_at || now,
            t.revoked_at ?? null,
            t.revoked_reason ?? null,
            t.replaced_by_token_id ?? null,
            t.user_agent ?? null,
            t.ip_address ?? null
        );
    }

    const insLink = db.prepare(
        `INSERT INTO user_pos_links (user_id, company_id, created_at) VALUES (?, ?, ?)`
    );
    for (const l of data.user_pos_links || []) {
        insLink.run(l.user_id, l.company_id, l.created_at || now);
    }

    const insPay = db.prepare(
        `INSERT INTO payments (
            id, payment_id, coin_id, method, amount, address, status, confirmed, tx_hash,
            created_at, confirmed_at, company_id, cashier_id, phone_number, security_code, usd_amount, rate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const p of data.payments || []) {
        const id = p.id || p.payment_id;
        insPay.run(
            id,
            p.payment_id,
            p.coin_id ?? null,
            p.method ?? null,
            p.amount ?? null,
            p.address ?? null,
            p.status ?? 'pending',
            p.confirmed ? 1 : 0,
            p.tx_hash ?? null,
            p.created_at || now,
            p.confirmed_at ?? null,
            p.company_id ?? null,
            p.cashier_id ?? null,
            p.phone_number ?? p.phoneNumber ?? null,
            p.security_code ?? p.securityCode ?? null,
            p.usd_amount ?? p.usdAmount ?? null,
            p.rate != null ? String(p.rate) : null
        );
    }

    const insLog = db.prepare(
        `INSERT INTO admin_logs (id, admin_id, action, details, ip_address, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
    );
    for (const l of data.admin_logs || []) {
        insLog.run(
            l.id,
            l.admin_id,
            l.action,
            l.details ?? null,
            l.ip_address ?? null,
            l.created_at || now
        );
    }

    if (data._meta && typeof data._meta === 'object') {
        const insMeta = db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)');
        for (const [k, v] of Object.entries(data._meta)) {
            insMeta.run(k, typeof v === 'string' ? v : JSON.stringify(v));
        }
    }
}

function verifyCounts(db, data) {
    const issues = [];
    for (const key of COLLECTIONS) {
        const expected = Array.isArray(data[key]) ? data[key].length : 0;
        const actual = rowCount(db, key);
        if (actual !== expected) {
            issues.push(`${key}: expected ${expected}, got ${actual}`);
        }
    }
    return issues;
}

function main() {
    const { dryRun, backup, confirm, force } = parseArgs(process.argv.slice(2));
    const jsonPath = defaultJsonPath();
    const sqlitePath = defaultSqlitePath();

    if (!fs.existsSync(jsonPath)) {
        console.error('Source JSON not found:', jsonPath);
        process.exit(1);
    }

    const data = readJsonDocument(jsonPath);
    const report = countReport(data);
    console.log('Source:', jsonPath);
    console.log('Target:', sqlitePath);
    console.log('Counts from JSON:', report);

    if (dryRun) {
        console.log('Dry run: no database writes.');
        process.exit(0);
    }

    if (!confirm) {
        console.error('Refusing to write without --confirm (use --dry-run to validate only).');
        process.exit(1);
    }

    if (backup) {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${jsonPath}.backup-${stamp}`;
        fs.copyFileSync(jsonPath, backupPath);
        console.log('Backed up JSON to', backupPath);
    }

    const db = openDatabase({ filename: sqlitePath });

    const hasRows =
        COLLECTIONS.some((t) => rowCount(db, t) > 0) || rowCount(db, 'meta') > 0;

    if (hasRows && !force) {
        console.error(
            'Target database already contains data. Re-run with --force to delete app rows first, or use a new SQLITE_PATH.'
        );
        db.close();
        process.exit(1);
    }

    if (force) {
        console.log('Wiping application tables (--force)...');
        wipeAppTables(db);
    }

    const run = db.transaction(() => importAll(db, data));
    run();

    const issues = verifyCounts(db, data);
    if (issues.length) {
        console.error('Verification failed:');
        for (const line of issues) console.error(' -', line);
        db.close();
        process.exit(1);
    }

    console.log('Import OK; row counts match JSON arrays.');
    db.close();
    process.exit(0);
}

main();
