const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { openDatabase } = require('./sqliteDb');

function toBoolInt(v) {
    if (v === true || v === 1 || v === '1') return 1;
    return 0;
}

function mapUserRow(row) {
    if (!row) return null;
    return {
        ...row,
        email_verified: Boolean(row.email_verified),
    };
}

class DatabaseManager {
    constructor() {
        this.isServerless = Boolean(
            process.env.VERCEL || process.env.VERCEL_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME
        );

        const dataDir = path.join(__dirname, 'data');
        const defaultSqlitePath = path.join(dataDir, 'crypto-pos.db');
        this.sqlitePath = process.env.SQLITE_PATH
            ? path.resolve(process.env.SQLITE_PATH)
            : defaultSqlitePath;
        if (this.isServerless) {
            this.db = openDatabase({ memory: true });
            console.log('SQLite: using in-memory database (serverless)');
        } else {
            this.db = openDatabase({ filename: this.sqlitePath });
            console.log('SQLite:', this.sqlitePath);
        }

        this.initDatabase();
    }

    initDatabase() {
        if (this._count('admin_users') === 0) {
            this.initDefaultAdmin();
        }
        if (this._count('companies') === 0) {
            this.initDefaultCompany();
        }
        if (this._count('coins') === 0) {
            this.migrateExistingCoins();
        }
    }

    _count(table) {
        const row = this.db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get();
        return row ? row.n : 0;
    }

    readData() {
        throw new Error('readData() removed; storage is SQLite-only');
    }

    writeData() {
        throw new Error('writeData() removed; storage is SQLite-only');
    }

    initDefaultAdmin() {
        const has = this.db.prepare('SELECT 1 FROM admin_users LIMIT 1').get();
        if (has) return;

        const defaultPassword = 'admin123';
        const passwordHash = bcrypt.hashSync(defaultPassword, 10);
        const createdAt = new Date().toISOString();

        this.db.prepare(
            `INSERT INTO admin_users (id, username, password_hash, created_at, last_login)
             VALUES (1, 'admin', ?, ?, NULL)`
        ).run(passwordHash, createdAt);

        console.log('⚠️  Default admin user created:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   ⚠️  PLEASE CHANGE THIS PASSWORD IMMEDIATELY!');
    }

    migrateExistingCoins() {
        const has = this.db.prepare('SELECT 1 FROM coins LIMIT 1').get();
        if (has) return;

        const now = new Date().toISOString();
        const defaultCoins = [
            {
                id: 'btc',
                name: 'Bitcoin',
                symbol: 'BTC',
                enabled: 1,
                network: 'mainnet',
                wallet_address: 'bc1qh5n4uall8hqeshtlklp3p2k02dz7zj2y96xkva',
                api_url: 'https://blockstream.info/api',
                api_key: null,
                contract_address: null,
                confirmations_required: 1,
                icon: 'btc.png',
                decimals: 8,
                method_code: 'btc',
            },
            {
                id: 'usdt-avax',
                name: 'USDT',
                symbol: 'USDT',
                enabled: 1,
                network: 'mainnet',
                wallet_address: '0x0029B302c6a0858b5648302dA5F4b24b67fBb364',
                api_url: 'https://api.snowtrace.io/api',
                api_key: 'rs_ce1e170ba51f9f9bbe4ce524',
                contract_address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
                confirmations_required: 1,
                icon: 'USDT.jfif',
                decimals: 6,
                method_code: 'usdt-avax',
            },
            {
                id: 'avax',
                name: 'AVAX',
                symbol: 'AVAX',
                enabled: 1,
                network: 'mainnet',
                wallet_address: '0x91870B9c25C06E10Bcb88bdd0F7b43A13C2d7c41',
                api_url: 'https://api.snowtrace.io/api',
                api_key: 'rs_ce1e170ba51f9f9bbe4ce524',
                contract_address: null,
                confirmations_required: 1,
                icon: 'avax.png',
                decimals: 18,
                method_code: 'avax',
            },
            {
                id: 'usdc-avax',
                name: 'USDC',
                symbol: 'USDC',
                enabled: 1,
                network: 'mainnet',
                wallet_address: '0x91870B9c25C06E10Bcb88bdd0F7b43A13C2d7c41',
                api_url: 'https://api.snowtrace.io/api',
                api_key: 'rs_ce1e170ba51f9f9bbe4ce524',
                contract_address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
                confirmations_required: 1,
                icon: 'usdc.svg',
                decimals: 6,
                method_code: 'usdc-avax',
            },
            {
                id: 'AVAX0',
                name: 'AVAX0',
                symbol: 'AVAX0',
                enabled: 1,
                network: 'mainnet',
                wallet_address: '0x0029B302c6a0858b5648302dA5F4b24b67fBb364',
                api_url: 'https://api.snowtrace.io/api',
                api_key: 'rs_ce1e170ba51f9f9bbe4ce524',
                contract_address: '0x91870B9c25C06E10Bcb88bdd0F7b43A13C2d7c41',
                confirmations_required: 1,
                icon: 'avax0.png',
                decimals: 18,
                method_code: 'AVAX0',
            },
        ];

        const ins = this.db.prepare(
            `INSERT INTO coins (
                id, name, symbol, enabled, network, wallet_address, api_url, api_key,
                contract_address, confirmations_required, icon, decimals, method_code, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );

        const tx = this.db.transaction((coins) => {
            for (const c of coins) {
                ins.run(
                    c.id,
                    c.name,
                    c.symbol,
                    c.enabled,
                    c.network,
                    c.wallet_address,
                    c.api_url,
                    c.api_key,
                    c.contract_address,
                    c.confirmations_required,
                    c.icon,
                    c.decimals,
                    c.method_code,
                    now,
                    now
                );
            }
        });
        tx(defaultCoins);
        console.log('✅ Migrated existing coins to database');
    }

    getAllCoins() {
        const rows = this.db
            .prepare('SELECT * FROM coins ORDER BY name COLLATE NOCASE ASC')
            .all();
        return rows;
    }

    getEnabledCoins() {
        return this.db
            .prepare('SELECT * FROM coins WHERE enabled = 1 ORDER BY name COLLATE NOCASE ASC')
            .all();
    }

    getCoinById(id) {
        return this.db.prepare('SELECT * FROM coins WHERE id = ?').get(id) || null;
    }

    getCoinByMethodCode(methodCode) {
        if (!methodCode) return null;
        const normalizedMethodCode = String(methodCode).toLowerCase();
        return (
            this.db
                .prepare(
                    `SELECT * FROM coins
                     WHERE lower(method_code) = ? AND enabled = 1 LIMIT 1`
                )
                .get(normalizedMethodCode) || null
        );
    }

    createCoin(coinData) {
        const now = new Date().toISOString();
        const coin = {
            id: coinData.id,
            name: coinData.name,
            symbol: coinData.symbol,
            enabled: coinData.enabled !== undefined ? coinData.enabled : 1,
            network: coinData.network || 'mainnet',
            wallet_address: coinData.wallet_address || null,
            api_url: coinData.api_url || null,
            api_key: coinData.api_key || null,
            contract_address: coinData.contract_address || null,
            confirmations_required: coinData.confirmations_required || 1,
            icon: coinData.icon || null,
            decimals: coinData.decimals || 18,
            method_code: coinData.method_code,
            created_at: now,
            updated_at: now,
        };

        this.db
            .prepare(
                `INSERT INTO coins (
                    id, name, symbol, enabled, network, wallet_address, api_url, api_key,
                    contract_address, confirmations_required, icon, decimals, method_code, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .run(
                coin.id,
                coin.name,
                coin.symbol,
                coin.enabled,
                coin.network,
                coin.wallet_address,
                coin.api_url,
                coin.api_key,
                coin.contract_address,
                coin.confirmations_required,
                coin.icon,
                coin.decimals,
                coin.method_code,
                coin.created_at,
                coin.updated_at
            );

        return coin;
    }

    updateCoin(id, coinData) {
        const existing = this.getCoinById(id);
        if (!existing) return null;

        const next = { ...existing };
        Object.keys(coinData).forEach((key) => {
            if (key !== 'id' && coinData[key] !== undefined) {
                next[key] = coinData[key];
            }
        });
        next.updated_at = new Date().toISOString();

        this.db
            .prepare(
                `UPDATE coins SET
                    name = ?, symbol = ?, enabled = ?, network = ?, wallet_address = ?, api_url = ?,
                    api_key = ?, contract_address = ?, confirmations_required = ?, icon = ?, decimals = ?,
                    method_code = ?, updated_at = ?
                 WHERE id = ?`
            )
            .run(
                next.name,
                next.symbol,
                next.enabled,
                next.network,
                next.wallet_address,
                next.api_url,
                next.api_key,
                next.contract_address,
                next.confirmations_required,
                next.icon,
                next.decimals,
                next.method_code,
                next.updated_at,
                id
            );

        return this.getCoinById(id);
    }

    deleteCoin(id) {
        const info = this.db.prepare('DELETE FROM coins WHERE id = ?').run(id);
        return info.changes > 0;
    }

    toggleCoinEnabled(id, enabled) {
        const coin = this.getCoinById(id);
        if (!coin) return null;
        const en = enabled ? 1 : 0;
        const updated_at = new Date().toISOString();
        this.db
            .prepare('UPDATE coins SET enabled = ?, updated_at = ? WHERE id = ?')
            .run(en, updated_at, id);
        return this.getCoinById(id);
    }

    createPayment(paymentData) {
        const id = paymentData.id || paymentData.paymentId;
        const payment_id = paymentData.paymentId;
        const created_at = new Date().toISOString();

        const row = {
            id,
            payment_id,
            coin_id: paymentData.coinId ?? null,
            method: paymentData.method ?? null,
            amount: paymentData.amount ?? null,
            address: paymentData.address ?? null,
            status: paymentData.status || 'pending',
            confirmed: toBoolInt(paymentData.confirmed),
            tx_hash: paymentData.tx_hash ?? null,
            created_at,
            confirmed_at: paymentData.confirmed_at ?? null,
            company_id: paymentData.company_id ?? null,
            cashier_id: paymentData.cashier_id ?? null,
            phone_number: paymentData.phoneNumber ?? paymentData.phone_number ?? null,
            security_code: paymentData.securityCode ?? paymentData.security_code ?? null,
            usd_amount:
                paymentData.usdAmount !== undefined && paymentData.usdAmount !== null
                    ? Number(paymentData.usdAmount)
                    : null,
            rate:
                paymentData.rate !== undefined && paymentData.rate !== null
                    ? String(paymentData.rate)
                    : null,
        };

        this.db
            .prepare(
                `INSERT INTO payments (
                    id, payment_id, coin_id, method, amount, address, status, confirmed, tx_hash,
                    created_at, confirmed_at, company_id, cashier_id, phone_number, security_code, usd_amount, rate
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .run(
                row.id,
                row.payment_id,
                row.coin_id,
                row.method,
                row.amount,
                row.address,
                row.status,
                row.confirmed,
                row.tx_hash,
                row.created_at,
                row.confirmed_at,
                row.company_id,
                row.cashier_id,
                row.phone_number,
                row.security_code,
                row.usd_amount,
                row.rate
            );

        return this.getPaymentById(payment_id);
    }

    getPaymentById(paymentId) {
        const p = this.db.prepare('SELECT * FROM payments WHERE payment_id = ?').get(paymentId);
        return p || null;
    }

    updatePayment(paymentId, updates) {
        const payment = this.getPaymentById(paymentId);
        if (!payment) return null;

        const next = { ...payment };
        Object.keys(updates).forEach((key) => {
            if (updates[key] === undefined) return;
            if (key === 'confirmed') {
                next.confirmed = toBoolInt(updates[key]);
            } else {
                next[key] = updates[key];
            }
        });

        this.db
            .prepare(
                `UPDATE payments SET
                    coin_id = ?, method = ?, amount = ?, address = ?, status = ?, confirmed = ?,
                    tx_hash = ?, confirmed_at = ?, company_id = ?, cashier_id = ?,
                    phone_number = ?, security_code = ?, usd_amount = ?, rate = ?
                 WHERE payment_id = ?`
            )
            .run(
                next.coin_id,
                next.method,
                next.amount,
                next.address,
                next.status,
                next.confirmed,
                next.tx_hash,
                next.confirmed_at,
                next.company_id,
                next.cashier_id,
                next.phone_number,
                next.security_code,
                next.usd_amount,
                next.rate,
                paymentId
            );

        return this.getPaymentById(paymentId);
    }

    getPayments(limit = 100, offset = 0, filters = {}) {
        const conditions = [];
        const params = [];

        if (filters.status) {
            conditions.push('p.status = ?');
            params.push(filters.status);
        }
        if (filters.coinId) {
            conditions.push('p.coin_id = ?');
            params.push(filters.coinId);
        }
        if (filters.method) {
            conditions.push('lower(p.method) = ?');
            params.push(String(filters.method).toLowerCase());
        }
        if (filters.startDate) {
            conditions.push('p.created_at >= ?');
            params.push(filters.startDate);
        }
        if (filters.endDate) {
            conditions.push('p.created_at <= ?');
            params.push(filters.endDate);
        }
        if (filters.companyId) {
            conditions.push('(p.company_id IS NULL OR p.company_id = ?)');
            params.push(filters.companyId);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const sql = `
            SELECT p.*, c.name AS coin_name_join, c.symbol AS symbol_join
            FROM payments p
            LEFT JOIN coins c ON c.id = p.coin_id
            ${where}
            ORDER BY datetime(p.created_at) DESC
            LIMIT ? OFFSET ?
        `;
        params.push(limit, offset);

        const rows = this.db.prepare(sql).all(...params);

        const methodLabels = {
            visa: { name: 'Visa', symbol: 'VISA' },
            mastercard: { name: 'Mastercard', symbol: 'MC' },
            unionpay: { name: 'UnionPay', symbol: 'UP' },
            'qr-code': { name: 'QR Code', symbol: 'QR' },
            gcash: { name: 'GCash', symbol: 'GCASH' },
            gpay: { name: 'Google Pay', symbol: 'GPAY' },
            'apple-pay': { name: 'Apple Pay', symbol: 'APAY' },
            'wechat-pay': { name: 'WeChat Pay', symbol: 'WECHAT' },
            alipay: { name: 'Alipay', symbol: 'ALIPAY' },
        };

        return rows.map((row) => {
            const {
                coin_name_join,
                symbol_join,
                ...payment
            } = row;
            const methodCode = String(payment.method || '').toLowerCase();
            const nonCrypto = methodLabels[methodCode] || null;
            return {
                ...payment,
                coin_name: coin_name_join || (nonCrypto ? nonCrypto.name : null),
                symbol: symbol_join || (nonCrypto ? nonCrypto.symbol : null),
            };
        });
    }

    getPaymentStats() {
        const row = this.db
            .prepare(
                `SELECT
                    COUNT(*) AS total,
                    SUM(CASE WHEN confirmed = 1 THEN 1 ELSE 0 END) AS confirmed,
                    SUM(CASE WHEN confirmed = 1 THEN COALESCE(amount, 0) ELSE 0 END) AS totalAmount
                 FROM payments`
            )
            .get();

        const total = row.total || 0;
        const confirmed = row.confirmed || 0;
        return {
            total,
            confirmed,
            pending: total - confirmed,
            totalAmount: row.totalAmount || 0,
        };
    }

    authenticateAdmin(username, password) {
        const admin = this.db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
        if (!admin) return null;

        if (bcrypt.compareSync(password, admin.password_hash)) {
            const last = new Date().toISOString();
            this.db.prepare('UPDATE admin_users SET last_login = ? WHERE id = ?').run(last, admin.id);
            return { id: admin.id, username: admin.username };
        }
        return null;
    }

    changeAdminPassword(adminId, newPassword) {
        const admin = this.db.prepare('SELECT 1 FROM admin_users WHERE id = ?').get(adminId);
        if (!admin) return false;
        const passwordHash = bcrypt.hashSync(newPassword, 10);
        this.db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(passwordHash, adminId);
        return true;
    }

    logAdminAction(adminId, action, details, ipAddress) {
        const nextIdRow = this.db.prepare('SELECT COALESCE(MAX(id), 0) + 1 AS n FROM admin_logs').get();
        const nextId = nextIdRow.n;
        const log = {
            id: nextId,
            admin_id: adminId,
            action,
            details: typeof details === 'string' ? details : JSON.stringify(details),
            ip_address: ipAddress,
            created_at: new Date().toISOString(),
        };
        this.db
            .prepare(
                `INSERT INTO admin_logs (id, admin_id, action, details, ip_address, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)`
            )
            .run(log.id, log.admin_id, log.action, log.details, log.ip_address, log.created_at);
    }

    getAdminLogs(limit = 100) {
        const logs = this.db
            .prepare(
                `SELECT l.*, u.username AS username
                 FROM admin_logs l
                 LEFT JOIN admin_users u ON u.id = l.admin_id
                 ORDER BY datetime(l.created_at) DESC
                 LIMIT ?`
            )
            .all(limit);
        return logs.map((l) => ({
            id: l.id,
            admin_id: l.admin_id,
            action: l.action,
            details: l.details,
            ip_address: l.ip_address,
            created_at: l.created_at,
            username: l.username,
        }));
    }

    initDefaultCompany() {
        const has = this.db.prepare('SELECT 1 FROM companies LIMIT 1').get();
        if (has) return;

        const isProduction = process.env.NODE_ENV === 'production';
        const defaultCompanyPassword = process.env.COMPANY_PASSWORD || 'company123';
        const defaultCashierPassword = process.env.CASHIER_PASSWORD || 'cashier123';

        if (isProduction && (!process.env.COMPANY_PASSWORD || !process.env.CASHIER_PASSWORD)) {
            console.warn(
                '⚠️  Production: Set COMPANY_PASSWORD and CASHIER_PASSWORD in .env. Using defaults is insecure.'
            );
        }

        const companyPasswordHash = bcrypt.hashSync(defaultCompanyPassword, 10);
        const company = {
            id: 'company_1',
            name: process.env.COMPANY_NAME || 'Default Company',
            password_hash: companyPasswordHash,
            status: 'active',
            created_at: new Date().toISOString(),
            last_login: null,
            settlement_addresses: '{}',
        };

        this.db
            .prepare(
                `INSERT INTO companies (id, name, password_hash, status, created_at, last_login, settlement_addresses)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
            )
            .run(
                company.id,
                company.name,
                company.password_hash,
                company.status,
                company.created_at,
                company.last_login,
                company.settlement_addresses
            );

        const cashierPasswordHash = bcrypt.hashSync(defaultCashierPassword, 10);
        const cashier = {
            id: 'cashier_1',
            company_id: company.id,
            name: process.env.CASHIER_NAME || 'Cashier 1',
            password_hash: cashierPasswordHash,
            status: 'active',
            created_at: new Date().toISOString(),
            last_login: null,
        };

        this.db
            .prepare(
                `INSERT INTO cashiers (id, company_id, name, password_hash, status, created_at, last_login)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
            )
            .run(
                cashier.id,
                cashier.company_id,
                cashier.name,
                cashier.password_hash,
                cashier.status,
                cashier.created_at,
                cashier.last_login
            );

        if (!isProduction) {
            console.log('Default company/cashier created. Change credentials in production (see .env.example).');
        }
    }

    syncDefaultCompanyCredentialsFromEnv() {
        const companyPassword = process.env.COMPANY_PASSWORD || 'company123';
        const cashierPassword = process.env.CASHIER_PASSWORD || 'cashier123';
        let companyUpdated = false;
        let cashierUpdated = false;

        const company = this.db.prepare('SELECT id FROM companies WHERE id = ?').get('company_1');
        if (company) {
            const hash = bcrypt.hashSync(companyPassword, 10);
            this.db.prepare('UPDATE companies SET password_hash = ? WHERE id = ?').run(hash, 'company_1');
            companyUpdated = true;
        }

        const cashier = this.db.prepare('SELECT id FROM cashiers WHERE id = ?').get('cashier_1');
        if (cashier) {
            const hash = bcrypt.hashSync(cashierPassword, 10);
            this.db.prepare('UPDATE cashiers SET password_hash = ? WHERE id = ?').run(hash, 'cashier_1');
            cashierUpdated = true;
        }

        return { companyUpdated, cashierUpdated };
    }

    _parseSettlementAddresses(raw) {
        if (raw == null || raw === '') return {};
        try {
            const o = typeof raw === 'string' ? JSON.parse(raw) : raw;
            return o && typeof o === 'object' ? o : {};
        } catch {
            return {};
        }
    }

    authenticateCompany(password) {
        const company = this.db
            .prepare(`SELECT * FROM companies WHERE status = 'active' ORDER BY created_at ASC LIMIT 1`)
            .get();
        if (!company) return null;

        if (bcrypt.compareSync(password, company.password_hash)) {
            const last = new Date().toISOString();
            this.db.prepare('UPDATE companies SET last_login = ? WHERE id = ?').run(last, company.id);
            return { id: company.id, name: company.name, status: company.status };
        }
        return null;
    }

    getCompanyById(companyId) {
        const row = this.db.prepare('SELECT * FROM companies WHERE id = ?').get(companyId);
        if (!row) return null;
        return {
            ...row,
            settlement_addresses: this._parseSettlementAddresses(row.settlement_addresses),
        };
    }

    listCompaniesForAdmin() {
        const rows = this.db
            .prepare(
                `SELECT id, name, status, created_at, last_login, settlement_addresses FROM companies ORDER BY created_at ASC`
            )
            .all();
        return rows.map((c) => ({
            id: c.id,
            name: c.name,
            status: c.status,
            created_at: c.created_at,
            last_login: c.last_login || null,
            settlement_addresses: this._parseSettlementAddresses(c.settlement_addresses),
        }));
    }

    listCashiersForAdmin(companyId) {
        return this.getCashiersByCompany(companyId).map((c) => ({
            id: c.id,
            name: c.name,
            company_id: c.company_id,
            status: c.status,
            created_at: c.created_at,
            last_login: c.last_login || null,
        }));
    }

    updateCompanySettlementAddresses(companyId, settlement_addresses) {
        const company = this.db.prepare('SELECT id FROM companies WHERE id = ?').get(companyId);
        if (!company) return null;

        const next =
            settlement_addresses && typeof settlement_addresses === 'object' ? { ...settlement_addresses } : {};
        Object.keys(next).forEach((k) => {
            const v = next[k];
            if (v === null || v === undefined || String(v).trim() === '') {
                delete next[k];
            }
        });

        this.db
            .prepare('UPDATE companies SET settlement_addresses = ? WHERE id = ?')
            .run(JSON.stringify(next), companyId);

        return this.listCompaniesForAdmin().find((c) => c.id === companyId) || null;
    }

    getUserPosLink(userId) {
        return this.db.prepare('SELECT * FROM user_pos_links WHERE user_id = ?').get(userId) || null;
    }

    upsertUserPosLink(userId, companyId) {
        const created_at = new Date().toISOString();
        this.db
            .prepare(
                `INSERT INTO user_pos_links (user_id, company_id, created_at)
                 VALUES (?, ?, ?)
                 ON CONFLICT(user_id) DO UPDATE SET company_id = excluded.company_id, created_at = excluded.created_at`
            )
            .run(userId, companyId, created_at);
        return this.getUserPosLink(userId);
    }

    deleteUserPosLink(userId) {
        const info = this.db.prepare('DELETE FROM user_pos_links WHERE user_id = ?').run(userId);
        return info.changes > 0;
    }

    getCashiersByCompany(companyId) {
        return this.db
            .prepare(
                `SELECT * FROM cashiers WHERE company_id = ? ORDER BY created_at ASC`
            )
            .all(companyId);
    }

    getCashierById(cashierId) {
        return this.db.prepare('SELECT * FROM cashiers WHERE id = ?').get(cashierId) || null;
    }

    createCashier(companyId, name, plainPassword) {
        const company = this.db.prepare('SELECT id FROM companies WHERE id = ?').get(companyId);
        if (!company) {
            throw new Error('Company not found');
        }
        const trimmedName = String(name || '').trim();
        if (!trimmedName || !plainPassword || String(plainPassword).length < 4) {
            throw new Error('Name and password (min 4 characters) are required');
        }
        const id = `cashier_${crypto.randomBytes(8).toString('hex')}`;
        const created_at = new Date().toISOString();
        const password_hash = bcrypt.hashSync(String(plainPassword), 10);

        this.db
            .prepare(
                `INSERT INTO cashiers (id, company_id, name, password_hash, status, created_at, last_login)
                 VALUES (?, ?, ?, ?, 'active', ?, NULL)`
            )
            .run(id, companyId, trimmedName, password_hash, created_at);

        return {
            id,
            name: trimmedName,
            company_id: companyId,
            status: 'active',
            created_at,
        };
    }

    authenticateCashier(companyId, cashierId, password) {
        const cashier = this.db
            .prepare(
                `SELECT * FROM cashiers
                 WHERE id = ? AND company_id = ? AND status = 'active'`
            )
            .get(cashierId, companyId);

        if (!cashier) return null;

        if (bcrypt.compareSync(password, cashier.password_hash)) {
            const last = new Date().toISOString();
            this.db.prepare('UPDATE cashiers SET last_login = ? WHERE id = ?').run(last, cashier.id);
            return {
                id: cashier.id,
                company_id: cashier.company_id,
                name: cashier.name,
                status: cashier.status,
            };
        }
        return null;
    }

    getUserById(userId) {
        return mapUserRow(this.db.prepare('SELECT * FROM users WHERE id = ?').get(userId));
    }

    getUserByEmail(email) {
        const normalized = String(email || '').trim().toLowerCase();
        return mapUserRow(
            this.db.prepare('SELECT * FROM users WHERE lower(email) = ? LIMIT 1').get(normalized)
        );
    }

    getUserByGoogleId(googleId) {
        return mapUserRow(this.db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId));
    }

    createUser(userData) {
        const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const now = new Date().toISOString();
        const user = {
            id,
            email: String(userData.email || '').trim().toLowerCase(),
            password_hash: userData.password_hash || null,
            name: userData.name || '',
            role: userData.role || 'user',
            provider: userData.provider || 'email',
            google_id: userData.google_id || null,
            email_verified: toBoolInt(userData.email_verified),
            status: userData.status || 'active',
            created_at: now,
            updated_at: now,
            last_login: null,
        };

        this.db
            .prepare(
                `INSERT INTO users (
                    id, email, password_hash, name, role, provider, google_id,
                    email_verified, status, created_at, updated_at, last_login
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .run(
                user.id,
                user.email,
                user.password_hash,
                user.name,
                user.role,
                user.provider,
                user.google_id,
                user.email_verified,
                user.status,
                user.created_at,
                user.updated_at,
                user.last_login
            );

        return this.getUserById(id);
    }

    updateUser(userId, updates) {
        const existing = this.getUserById(userId);
        if (!existing) return null;

        const next = { ...existing, ...updates, updated_at: new Date().toISOString() };
        if (updates.email !== undefined) {
            next.email = String(updates.email || '').trim().toLowerCase();
        }
        if (updates.email_verified !== undefined) {
            next.email_verified = toBoolInt(updates.email_verified);
        }

        this.db
            .prepare(
                `UPDATE users SET
                    email = ?, password_hash = ?, name = ?, role = ?, provider = ?, google_id = ?,
                    email_verified = ?, status = ?, updated_at = ?, last_login = ?
                 WHERE id = ?`
            )
            .run(
                next.email,
                next.password_hash,
                next.name,
                next.role,
                next.provider,
                next.google_id,
                toBoolInt(next.email_verified),
                next.status,
                next.updated_at,
                next.last_login,
                userId
            );

        return this.getUserById(userId);
    }

    authenticateUser(email, password) {
        const normalized = String(email || '').trim().toLowerCase();
        const user = this.db
            .prepare(
                `SELECT * FROM users WHERE lower(email) = ? AND status = 'active' LIMIT 1`
            )
            .get(normalized);

        if (!user || !user.password_hash) return null;
        if (!bcrypt.compareSync(password, user.password_hash)) return null;

        const now = new Date().toISOString();
        this.db.prepare('UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?').run(now, now, user.id);
        return this.getUserById(user.id);
    }

    createRefreshToken(tokenData) {
        const now = new Date().toISOString();
        const token = {
            id: tokenData.id,
            user_id: tokenData.user_id,
            token_hash: tokenData.token_hash,
            expires_at: tokenData.expires_at,
            created_at: now,
            revoked_at: null,
            revoked_reason: null,
            replaced_by_token_id: null,
            user_agent: tokenData.user_agent || null,
            ip_address: tokenData.ip_address || null,
        };

        this.db
            .prepare(
                `INSERT INTO refresh_tokens (
                    id, user_id, token_hash, expires_at, created_at, revoked_at, revoked_reason,
                    replaced_by_token_id, user_agent, ip_address
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .run(
                token.id,
                token.user_id,
                token.token_hash,
                token.expires_at,
                token.created_at,
                token.revoked_at,
                token.revoked_reason,
                token.replaced_by_token_id,
                token.user_agent,
                token.ip_address
            );

        return token;
    }

    getValidRefreshTokenByHash(tokenHash) {
        const now = Date.now();
        const rows = this.db
            .prepare(
                `SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL`
            )
            .all(tokenHash);

        return (
            rows.find((t) => t.expires_at && new Date(t.expires_at).getTime() > now) || null
        );
    }

    revokeRefreshToken(tokenId, reason = 'revoked', replacedByTokenId = null) {
        const token = this.db.prepare('SELECT * FROM refresh_tokens WHERE id = ?').get(tokenId);
        if (!token || token.revoked_at) return false;

        this.db
            .prepare(
                `UPDATE refresh_tokens SET revoked_at = ?, revoked_reason = ?, replaced_by_token_id = ?
                 WHERE id = ?`
            )
            .run(new Date().toISOString(), reason, replacedByTokenId || null, tokenId);
        return true;
    }

    revokeUserRefreshTokens(userId, reason = 'logout_all') {
        const now = new Date().toISOString();
        const info = this.db
            .prepare(
                `UPDATE refresh_tokens SET revoked_at = ?, revoked_reason = ?
                 WHERE user_id = ? AND revoked_at IS NULL`
            )
            .run(now, reason, userId);
        return info.changes > 0;
    }

    listUsers(opts = {}) {
        const search = String(opts.search || '').trim().toLowerCase();
        const role = String(opts.role || '').trim().toLowerCase();
        const provider = String(opts.provider || '').trim().toLowerCase();
        const status = String(opts.status || '').trim().toLowerCase();
        const limit = Math.min(Math.max(parseInt(opts.limit, 10) || 100, 1), 500);
        const offset = Math.max(parseInt(opts.offset, 10) || 0, 0);

        const conditions = [];
        const params = [];

        if (search) {
            conditions.push("(lower(COALESCE(email, '')) LIKE ? OR lower(COALESCE(name, '')) LIKE ?)");
            const q = `%${search}%`;
            params.push(q, q);
        }
        if (role) {
            conditions.push("lower(COALESCE(role, '')) = ?");
            params.push(role);
        }
        if (provider) {
            conditions.push("lower(COALESCE(provider, '')) LIKE ?");
            params.push(`%${provider}%`);
        }
        if (status) {
            conditions.push("lower(COALESCE(status, '')) = ?");
            params.push(status);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const countSql = `SELECT COUNT(*) AS n FROM users ${where}`;
        const total = this.db.prepare(countSql).get(...params).n;

        const listSql = `
            SELECT * FROM users ${where}
            ORDER BY datetime(created_at) DESC
            LIMIT ? OFFSET ?
        `;
        const slice = this.db.prepare(listSql).all(...params, limit, offset).map(mapUserRow);

        return { users: slice, total };
    }

    close() {
        try {
            this.db.close();
        } catch {
            // ignore
        }
    }
}

let dbInstance = null;

function getDatabase() {
    if (!dbInstance) {
        dbInstance = new DatabaseManager();
    }
    return dbInstance;
}

module.exports = { getDatabase, DatabaseManager };
