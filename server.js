const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { getDatabase } = require('./database');
const adminRoutes = require('./routes/admin');
const adminUsersRoutes = require('./routes/adminUsers');
const authRoutes = require('./routes/auth');
const { requireAuthHTML } = require('./middleware/auth');
require('dotenv').config();

/**
 * Express `trust proxy`: required when the app runs behind ngrok, nginx, a load balancer, etc.
 * so `req.ip` and express-rate-limit use `X-Forwarded-For` correctly (avoids ERR_ERL_UNEXPECTED_X_FORWARDED_FOR).
 * Set TRUST_PROXY to the number of hops (usually 1). Omit or false when Node is exposed directly.
 * @see https://expressjs.com/en/guide/behind-proxies.html
 */
function parseTrustProxy(raw) {
    if (raw === undefined || raw === null) return false;
    const s = String(raw).trim().toLowerCase();
    if (s === '' || s === 'false' || s === '0' || s === 'no') return false;
    if (s === 'true' || s === 'yes') return true;
    const n = parseInt(s, 10);
    if (!Number.isNaN(n) && n >= 0) return n;
    return false;
}

const app = express();
app.set('trust proxy', parseTrustProxy(process.env.TRUST_PROXY));
const PORT = process.env.PORT || 4000;

// CORS: allow Omarapay dashboard and local dev
const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
    : [];
const corsOptions = {
    origin: corsOrigins.length > 0
        ? (origin, callback) => {
            if (!origin) return callback(null, true);
            if (corsOrigins.includes('*') || corsOrigins.includes(origin)) return callback(null, true);
            callback(null, false);
        }
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Company-Token', 'X-Cashier-Token', 'X-Idempotency-Key', 'X-API-Key', 'ngrok-skip-browser-warning'],
};
app.use(cors(corsOptions));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Rate limiting: 200 requests per 15 min per IP for API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 200,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Initialize database
const db = getDatabase();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'crypto-pos-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Store active payment requests (in-memory for quick access, also stored in DB)
const activePayments = new Map();
const idempotencyStore = new Map();
const paymentEvents = new Map();

function isValidAmount(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return false;
    if (amount <= 0) return false;
    if (amount > 1000000) return false; // basic guardrail for bad payloads
    return true;
}

function getIdempotencyKey(req) {
    const headerKey = req.headers['x-idempotency-key'];
    const bodyKey = req.body?.idempotencyKey;
    const key = headerKey || bodyKey;
    return key ? String(key) : null;
}

function tryGetIdempotentResponse(req, res) {
    const key = getIdempotencyKey(req);
    if (!key) return null;
    const existing = idempotencyStore.get(key);
    if (!existing) return null;
    return res.status(existing.statusCode).json(existing.payload);
}

function storeIdempotentResponse(req, statusCode, payload) {
    const key = getIdempotencyKey(req);
    if (!key) return;
    idempotencyStore.set(key, {
        statusCode,
        payload,
        createdAt: Date.now(),
    });
}

function recordPaymentEvent(paymentId, eventType, details = {}) {
    const event = {
        id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        paymentId,
        type: eventType,
        details,
        createdAt: new Date().toISOString(),
    };
    if (!paymentEvents.has(paymentId)) {
        paymentEvents.set(paymentId, []);
    }
    paymentEvents.get(paymentId).push(event);
    return event;
}

// Card payment helpers
function sanitizeDigits(value) {
    return String(value || '').replace(/\D/g, '');
}

function isValidCardNumber(cardNumber) {
    const digits = sanitizeDigits(cardNumber);
    if (digits.length < 12 || digits.length > 19) return false;

    // Luhn check
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i -= 1) {
        let digit = parseInt(digits.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

function detectCardBrand(cardNumber) {
    const digits = sanitizeDigits(cardNumber);
    if (/^4/.test(digits)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
    if (/^62/.test(digits)) return 'unionpay';
    return 'card';
}

function isValidExpiry(expiryMonth, expiryYear) {
    const month = parseInt(expiryMonth, 10);
    const year = parseInt(expiryYear, 10);
    if (!month || month < 1 || month > 12 || !year) return false;

    const normalizedYear = year < 100 ? 2000 + year : year;
    const now = new Date();
    const expiryDate = new Date(normalizedYear, month, 0, 23, 59, 59, 999);
    return expiryDate >= now;
}

// Configuration is now stored in JSON database
// All config comes from database via /api/admin/coins endpoints

// Get enabled coins for POS frontend
app.get('/api/coins', async (req, res) => {
    try {
        const coins = db.getEnabledCoins();
        res.json({ coins });
    } catch (error) {
        console.error('Error fetching coins:', error);
        res.status(500).json({ error: 'Failed to fetch coins' });
    }
});

// Generate payment request
app.post('/api/payment/create', async (req, res) => {
    try {
        const existingResponse = tryGetIdempotentResponse(req, res);
        if (existingResponse) return existingResponse;

        const { method, amount, phoneNumber, securityCode, usdAmount, rate } = req.body;

        if (!method || !isValidAmount(amount)) {
            return res.status(400).json({ error: 'Invalid payment method or amount' });
        }

        // Get coin from database
        const coin = db.getCoinByMethodCode(method);
        if (!coin) {
            return res.status(400).json({ error: 'Payment method not available or disabled' });
        }

        if (!coin.wallet_address) {
            return res.status(500).json({
                error: `Wallet address not configured for ${coin.name}. Please configure in admin panel.`
            });
        }

        // Generate payment ID
        const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store payment in database
        const paymentData = {
            id: paymentId,
            paymentId,
            coinId: coin.id,
            method: coin.method_code,
            amount: parseFloat(amount),
            address: coin.wallet_address,
            status: 'pending',
            confirmed: false,
            phoneNumber: phoneNumber || null,
            securityCode: securityCode || null,
            usdAmount: usdAmount || null,
            rate: rate ? JSON.stringify(rate) : null,
        };

        db.createPayment(paymentData);

        // Also store in memory for quick access
        activePayments.set(paymentId, {
            ...paymentData,
            createdAt: new Date().toISOString(),
            coin: coin
        });

        recordPaymentEvent(paymentId, 'CRYPTO_PAYMENT_CREATED', {
            method: coin.method_code,
            amount: paymentData.amount,
            coinId: coin.id,
        });

        const responsePayload = {
            paymentId,
            address: coin.wallet_address,
            amount: paymentData.amount,
            method: coin.method_code,
            qrData: generateQRData(coin.method_code, coin.wallet_address, amount)
        };

        storeIdempotentResponse(req, 200, responsePayload);
        res.json(responsePayload);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Failed to create payment request' });
    }
});

// Process card payment (simulated processor for POS flow)
app.post('/api/card/payment/create', async (req, res) => {
    try {
        const existingResponse = tryGetIdempotentResponse(req, res);
        if (existingResponse) return existingResponse;

        const {
            method,
            amount,
            cardNumber,
            expiryMonth,
            expiryYear,
            cvv,
            cardholderName,
        } = req.body;

        if (!method || !isValidAmount(amount)) {
            return res.status(400).json({ error: 'Invalid card method or amount' });
        }

        const normalizedMethod = String(method).toLowerCase();
        const supportedCardMethods = new Set(['visa', 'mastercard', 'unionpay']);
        if (!supportedCardMethods.has(normalizedMethod)) {
            return res.status(400).json({ error: 'Unsupported card payment method' });
        }

        if (!isValidCardNumber(cardNumber)) {
            return res.status(400).json({ error: 'Invalid card number' });
        }

        if (!isValidExpiry(expiryMonth, expiryYear)) {
            return res.status(400).json({ error: 'Card is expired or expiry date is invalid' });
        }

        const cvvDigits = sanitizeDigits(cvv);
        if (!/^\d{3,4}$/.test(cvvDigits)) {
            return res.status(400).json({ error: 'Invalid CVV' });
        }

        if (!cardholderName || String(cardholderName).trim().length < 2) {
            return res.status(400).json({ error: 'Cardholder name is required' });
        }

        const digits = sanitizeDigits(cardNumber);
        const last4 = digits.slice(-4);
        const brand = detectCardBrand(digits);
        const paymentId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
        const authCode = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        const createdAt = new Date().toISOString();

        // Persist to DB so admin/payment history includes non-crypto methods too.
        db.createPayment({
            id: paymentId,
            paymentId,
            coinId: null,
            method: normalizedMethod,
            amount: parseFloat(amount),
            address: null,
            status: 'confirmed',
            confirmed: true,
        });
        db.updatePayment(paymentId, {
            confirmed_at: createdAt,
        });

        // Keep a normalized payment object in-memory for receipt and status inspection
        activePayments.set(paymentId, {
            id: paymentId,
            paymentId,
            method: normalizedMethod,
            amount: parseFloat(amount),
            usdAmount: parseFloat(amount),
            address: null,
            status: 'confirmed',
            confirmed: true,
            createdAt,
            confirmedAt: createdAt,
            txHash: null,
            card: {
                brand,
                last4,
                expiryMonth: String(expiryMonth).padStart(2, '0'),
                expiryYear: String(expiryYear).slice(-2),
                cardholderName: String(cardholderName).trim(),
                authCode,
            },
        });

        recordPaymentEvent(paymentId, 'CARD_PAYMENT_CONFIRMED', {
            method: normalizedMethod,
            amount: parseFloat(amount),
            brand,
            last4,
            approved: true,
        });

        const responsePayload = {
            success: true,
            paymentId,
            method: normalizedMethod,
            status: 'confirmed',
            approved: true,
            amount: parseFloat(amount),
            currency: 'USD',
            card: {
                brand,
                last4,
                authCode,
            },
            createdAt,
        };

        storeIdempotentResponse(req, 200, responsePayload);
        return res.json(responsePayload);
    } catch (error) {
        console.error('Error processing card payment:', error);
        return res.status(500).json({ error: 'Failed to process card payment' });
    }
});

// Process QR wallet payment (simulated approval flow for POS)
app.post('/api/qr/payment/create', async (req, res) => {
    try {
        const existingResponse = tryGetIdempotentResponse(req, res);
        if (existingResponse) return existingResponse;

        const { method, amount, phoneNumber, methodName } = req.body;

        if (!method || !isValidAmount(amount)) {
            return res.status(400).json({ error: 'Invalid QR wallet method or amount' });
        }

        const normalizedMethod = String(method).toLowerCase();
        const supportedQRMethods = new Set(['qr-code', 'gcash', 'wechat-pay', 'alipay', 'gpay', 'apple-pay']);
        if (!supportedQRMethods.has(normalizedMethod)) {
            return res.status(400).json({ error: 'Unsupported QR wallet method' });
        }

        const paymentId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
        const createdAt = new Date().toISOString();
        const reference = `QRPAY-${Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`;

        const qrPayload = JSON.stringify({
            type: 'QR_WALLET_PAYMENT',
            method: normalizedMethod,
            methodName: methodName || normalizedMethod.toUpperCase(),
            amount: parseFloat(amount).toFixed(2),
            currency: 'USD',
            phoneNumber: phoneNumber || null,
            reference,
            createdAt,
        });

        // Persist to DB so admin/payment history includes non-crypto methods too.
        db.createPayment({
            id: paymentId,
            paymentId,
            coinId: null,
            method: normalizedMethod,
            amount: parseFloat(amount),
            address: null,
            status: 'confirmed',
            confirmed: true,
            phoneNumber: phoneNumber || null,
        });
        db.updatePayment(paymentId, {
            confirmed_at: createdAt,
            tx_hash: reference,
        });

        activePayments.set(paymentId, {
            id: paymentId,
            paymentId,
            method: normalizedMethod,
            amount: parseFloat(amount),
            usdAmount: parseFloat(amount),
            address: null,
            status: 'confirmed',
            confirmed: true,
            createdAt,
            confirmedAt: createdAt,
            txHash: null,
            qrData: qrPayload,
            reference,
            phoneNumber: phoneNumber || null,
        });

        recordPaymentEvent(paymentId, 'QR_WALLET_PAYMENT_CONFIRMED', {
            method: normalizedMethod,
            amount: parseFloat(amount),
            reference,
            phoneNumber: phoneNumber || null,
            approved: true,
        });

        const responsePayload = {
            success: true,
            paymentId,
            method: normalizedMethod,
            status: 'confirmed',
            approved: true,
            amount: parseFloat(amount),
            currency: 'USD',
            reference,
            qrData: qrPayload,
            createdAt,
        };

        storeIdempotentResponse(req, 200, responsePayload);
        return res.json(responsePayload);
    } catch (error) {
        console.error('Error processing QR wallet payment:', error);
        return res.status(500).json({ error: 'Failed to process QR wallet payment' });
    }
});

// Check payment status
app.get('/api/payment/status/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;

        // Try to get from memory first, then database
        let payment = activePayments.get(paymentId);
        if (!payment) {
            const dbPayment = db.getPaymentById(paymentId);
            if (!dbPayment) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            // Get coin info
            const coin = db.getCoinById(dbPayment.coin_id);
            payment = {
                ...dbPayment,
                method: dbPayment.method,
                address: dbPayment.address,
                coin: coin
            };
        }

        // Check blockchain for payment
        const paymentStatus = await checkBlockchainPayment(payment);

        // Update payment status in database and memory
        if (paymentStatus.confirmed && !payment.confirmed) {
            db.updatePayment(paymentId, {
                confirmed: true,
                status: 'confirmed',
                confirmed_at: new Date().toISOString(),
                tx_hash: paymentStatus.txHash
            });

            recordPaymentEvent(paymentId, 'CRYPTO_PAYMENT_CONFIRMED', {
                txHash: paymentStatus.txHash || null,
                amount: paymentStatus.amount || null,
            });

            if (activePayments.has(paymentId)) {
                payment.confirmed = true;
                payment.status = 'confirmed';
                payment.confirmedAt = new Date().toISOString();
                payment.txHash = paymentStatus.txHash;
            }
        }

        const dbPayment = db.getPaymentById(paymentId);
        res.json({
            paymentId: dbPayment.payment_id,
            status: dbPayment.status,
            confirmed: dbPayment.confirmed === 1,
            amount: dbPayment.amount,
            method: dbPayment.method,
            address: dbPayment.address,
            txHash: dbPayment.tx_hash,
            createdAt: dbPayment.created_at,
            confirmedAt: dbPayment.confirmed_at
        });
    } catch (error) {
        console.error('Error checking payment status:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});

// Simulate payment confirmation (dev only – for testing without sending real crypto)
if (process.env.NODE_ENV !== 'production') {
    app.post('/api/payment/:paymentId/simulate-confirm', (req, res) => {
        try {
            const { paymentId } = req.params;
            const dbPayment = db.getPaymentById(paymentId);
            if (!dbPayment) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            if (dbPayment.confirmed === 1) {
                return res.json({
                    paymentId: dbPayment.payment_id,
                    status: 'confirmed',
                    confirmed: true,
                    amount: dbPayment.amount,
                    method: dbPayment.method,
                    address: dbPayment.address,
                    txHash: dbPayment.tx_hash,
                    createdAt: dbPayment.created_at,
                    confirmedAt: dbPayment.confirmed_at
                });
            }
            const now = new Date().toISOString();
            const simulatedTxHash = `0x_simulated_${Date.now().toString(36)}`;
            db.updatePayment(paymentId, {
                confirmed: true,
                status: 'confirmed',
                confirmed_at: now,
                tx_hash: simulatedTxHash
            });
            const inMemory = activePayments.get(paymentId);
            if (inMemory) {
                inMemory.confirmed = true;
                inMemory.status = 'confirmed';
                inMemory.confirmedAt = now;
                inMemory.txHash = simulatedTxHash;
                activePayments.set(paymentId, inMemory);
            }
            const updated = db.getPaymentById(paymentId);
            res.json({
                paymentId: updated.payment_id,
                status: updated.status,
                confirmed: updated.confirmed === 1,
                amount: updated.amount,
                method: updated.method,
                address: updated.address,
                txHash: updated.tx_hash,
                createdAt: updated.created_at,
                confirmedAt: updated.confirmed_at
            });
        } catch (error) {
            console.error('Error simulating payment confirm:', error);
            res.status(500).json({ error: 'Failed to simulate confirmation' });
        }
    });
}

// Payment events timeline (for debugging and audit)
app.get('/api/payment/events/:paymentId', (req, res) => {
    try {
        if (!req.session || !req.session.adminId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { paymentId } = req.params;
        const events = paymentEvents.get(paymentId) || [];
        res.json({
            paymentId,
            count: events.length,
            events,
        });
    } catch (error) {
        console.error('Error fetching payment events:', error);
        res.status(500).json({ error: 'Failed to fetch payment events' });
    }
});

// Check blockchain for payment
async function checkBlockchainPayment(payment) {
    try {
        // Get coin data (from payment object or database)
        let coin = payment.coin;
        if (!coin && payment.coinId) {
            coin = db.getCoinById(payment.coinId);
        }
        if (!coin && payment.method) {
            coin = db.getCoinByMethodCode(payment.method);
        }

        if (!coin) {
            console.error('Coin not found for payment:', payment.method);
            return { confirmed: false };
        }

        // Route to appropriate checker based on coin type
        if (coin.id === 'btc') {
            return await checkBTCPayment(payment, coin);
        } else if (coin.contract_address) {
            // Token payment (USDT, USDC, etc.)
            return await checkTokenPayment(payment, coin);
        } else {
            // Native coin payment (AVAX, etc.)
            return await checkNativePayment(payment, coin);
        }
    } catch (error) {
        console.error(`Error checking ${payment.method} payment:`, error);
        return { confirmed: false };
    }
}

// Check Bitcoin payment
async function checkBTCPayment(payment, coin) {
    try {
        const apiUrl = coin.api_url || 'https://blockstream.info/api';
        const response = await axios.get(
            `${apiUrl}/address/${payment.address}/txs`,
            { timeout: 10000 }
        );

        const transactions = response.data || [];

        // Check recent transactions
        for (const tx of transactions.slice(0, 10)) {
            // Check if transaction is recent (within last hour)
            const txTime = tx.status.block_time * 1000;
            const paymentTime = new Date(payment.createdAt).getTime();

            if (txTime >= paymentTime) {
                // Calculate total received in this transaction
                let totalReceived = 0;
                for (const vout of tx.vout || []) {
                    if (vout.scriptpubkey_address === payment.address) {
                        totalReceived += vout.value / 100000000; // Convert satoshi to BTC
                    }
                }

                // Check if amount matches (with small tolerance for fees)
                const tolerance = 0.0001; // 0.0001 BTC tolerance
                if (Math.abs(totalReceived - payment.amount) <= tolerance || totalReceived >= payment.amount) {
                    return {
                        confirmed: true,
                        txHash: tx.txid,
                        amount: totalReceived
                    };
                }
            }
        }

        return { confirmed: false };
    } catch (error) {
        if (error.response?.status === 404) {
            // Address has no transactions yet
            return { confirmed: false };
        }
        throw error;
    }
}

// Check token payment (USDT, USDC, etc.)
async function checkTokenPayment(payment, coin) {
    try {
        const apiUrl = coin.api_url || 'https://api.snowtrace.io/api';
        const apiKey = coin.api_key ? `&apikey=${coin.api_key}` : '';
        const contractAddress = coin.contract_address;
        const decimals = coin.decimals || 6;

        const response = await axios.get(
            `${apiUrl}?module=account&action=tokentx&contractaddress=${contractAddress}&address=${payment.address}&startblock=0&endblock=99999999&sort=desc${apiKey}`,
            { timeout: 10000 }
        );

        if (response.data.status !== '1' || !response.data.result) {
            return { confirmed: false };
        }

        const transactions = response.data.result || [];
        const paymentTime = new Date(payment.createdAt || payment.created_at).getTime();

        for (const tx of transactions) {
            const txTime = parseInt(tx.timeStamp) * 1000;

            // Check if transaction is recent and incoming
            if (txTime >= paymentTime &&
                tx.to.toLowerCase() === payment.address.toLowerCase() &&
                (tx.tokenSymbol === coin.symbol || tx.contractAddress?.toLowerCase() === contractAddress.toLowerCase())) {

                const receivedAmount = parseInt(tx.value) / Math.pow(10, decimals);

                // Check if amount matches (with small tolerance)
                const tolerance = 0.01;
                if (Math.abs(receivedAmount - payment.amount) <= tolerance || receivedAmount >= payment.amount) {
                    return {
                        confirmed: true,
                        txHash: tx.hash,
                        amount: receivedAmount
                    };
                }
            }
        }

        return { confirmed: false };
    } catch (error) {
        if (error.response?.status === 404 || error.response?.data?.status === '0') {
            return { confirmed: false };
        }
        throw error;
    }
}

// Check native coin payment (AVAX, etc.)
async function checkNativePayment(payment, coin) {
    try {
        // Use testnet or mainnet API based on network setting
        let apiUrl = coin.api_url;
        if (coin.network === 'testnet' && coin.id === 'avax') {
            apiUrl = 'https://api-testnet.snowtrace.io/api';
        }
        const apiKey = coin.api_key ? `&apikey=${coin.api_key}` : '';

        const response = await axios.get(
            `${apiUrl}?module=account&action=txlist&address=${payment.address}&startblock=0&endblock=99999999&sort=desc${apiKey}`,
            { timeout: 10000 }
        );

        if (response.data.status !== '1' || !response.data.result) {
            return { confirmed: false };
        }

        const transactions = response.data.result || [];
        const paymentTime = new Date(payment.createdAt || payment.created_at).getTime();
        const decimals = coin.decimals || 18;

        for (const tx of transactions) {
            const txTime = parseInt(tx.timeStamp) * 1000;

            // Check if transaction is recent and incoming
            if (txTime >= paymentTime &&
                tx.to.toLowerCase() === payment.address.toLowerCase() &&
                tx.value !== '0') {

                const receivedAmount = parseFloat(tx.value) / Math.pow(10, decimals);

                // Check if amount matches (with small tolerance)
                const tolerance = 0.01;
                if (Math.abs(receivedAmount - payment.amount) <= tolerance || receivedAmount >= payment.amount) {
                    return {
                        confirmed: true,
                        txHash: tx.hash,
                        amount: receivedAmount
                    };
                }
            }
        }

        return { confirmed: false };
    } catch (error) {
        if (error.response?.status === 404 || error.response?.data?.status === '0') {
            return { confirmed: false };
        }
        throw error;
    }
}

// Generate QR code data
function generateQRData(method, address, amount) {
    if (method === 'btc') {
        // Bitcoin URI format
        return `bitcoin:${address}?amount=${amount}`;
    } else if (method === 'usdt-avax') {
        // For USDT, we can use a simple address or add amount parameter
        // Some wallets support ethereum: URI format
        return address; // Simple address for QR code
    } else if (method === 'avax') {
        // For AVAX, use simple address (some wallets support ethereum: format)
        return address; // Simple address for QR code
    } else if (method === 'usdc-avax') {
        // For USDC, use simple address (some wallets support ethereum: format)
        return address; // Simple address for QR code
    }
    return address;
}

// Generate QR code image (server-side fallback)
app.get('/api/qrcode/:data', async (req, res) => {
    try {
        const { data } = req.params;
        const decodedData = decodeURIComponent(data);
        // Use a QR code API service as fallback (free, no key required)
        const encodedData = encodeURIComponent(decodedData);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;

        // Proxy the QR code image
        const response = await axios.get(qrUrl, {
            responseType: 'arraybuffer',
            timeout: 10000
        });

        res.set({
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600'
        });
        res.send(response.data);
    } catch (error) {
        console.error('QR code generation error:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

// Cleanup old payments
function cleanupOldPayments() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [id, payment] of activePayments.entries()) {
        const paymentTime = new Date(payment.createdAt).getTime();
        if (paymentTime < oneHourAgo) {
            activePayments.delete(id);
            paymentEvents.delete(id);
        }
    }

    // Cleanup idempotency cache entries older than 1 hour
    for (const [key, item] of idempotencyStore.entries()) {
        if (!item?.createdAt || item.createdAt < oneHourAgo) {
            idempotencyStore.delete(key);
        }
    }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        activePayments: activePayments.size
    });
});

// Get crypto rate
app.get('/api/payment/crypto-rate/:methodCode', async (req, res) => {
    try {
        const { methodCode } = req.params;
        const { amount } = req.query;
        const usdAmount = parseFloat(amount) || 100;

        // Get coin from database
        const coin = db.getCoinByMethodCode(methodCode);
        if (!coin) {
            return res.status(404).json({ error: 'Cryptocurrency not found' });
        }

        // Mock rate calculation (in production, fetch from exchange API)
        // For now, use simple conversion rates
        const rates = {
            'btc': 45000, // USD per BTC
            'eth': 2500,  // USD per ETH
            'link': 15,   // USD per LINK
            'dot': 7,     // USD per DOT
            'bnb': 300,   // USD per BNB
            'trx': 0.1,   // USD per TRX
        };

        const usdRate = rates[methodCode.toLowerCase()] || 1;
        const cryptoAmount = usdAmount / usdRate;

        res.json({
            methodCode,
            usdAmount,
            cryptoAmount,
            usdRate,
            symbol: coin.symbol,
            name: coin.name,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching crypto rate:', error);
        res.status(500).json({ error: 'Failed to fetch crypto rate' });
    }
});

// Generate security code
const securityCodes = new Map(); // Store codes temporarily

app.post('/api/payment/generate-security-code', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store code with expiration (60 seconds)
        securityCodes.set(phoneNumber, {
            code,
            expiresAt: Date.now() + 60000, // 60 seconds
        });

        // Cleanup expired codes
        setTimeout(() => {
            const stored = securityCodes.get(phoneNumber);
            if (stored && Date.now() > stored.expiresAt) {
                securityCodes.delete(phoneNumber);
            }
        }, 60000);

        // In production, send SMS with code
        // For now, just return it (in production, don't return it)
        console.log(`Security code for ${phoneNumber}: ${code}`);

        res.json({
            success: true,
            code, // Remove this in production - code should only be sent via SMS
            expiresIn: 60,
            phoneNumber,
        });
    } catch (error) {
        console.error('Error generating security code:', error);
        res.status(500).json({ error: 'Failed to generate security code' });
    }
});

// Verify security code
app.post('/api/payment/verify-security-code', async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;

        if (!phoneNumber || !code) {
            return res.status(400).json({ error: 'Phone number and code are required' });
        }

        const stored = securityCodes.get(phoneNumber);
        if (!stored) {
            return res.status(404).json({ error: 'No security code found for this phone number' });
        }

        if (Date.now() > stored.expiresAt) {
            securityCodes.delete(phoneNumber);
            return res.status(400).json({ error: 'Security code has expired' });
        }

        if (stored.code !== code) {
            return res.status(401).json({ error: 'Invalid security code' });
        }

        // Code is valid
        res.json({
            success: true,
            valid: true,
        });
    } catch (error) {
        console.error('Error verifying security code:', error);
        res.status(500).json({ error: 'Failed to verify security code' });
    }
});

// Get receipt data
app.get('/api/receipt/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;

        // Try to get from memory first, then database
        let payment = activePayments.get(paymentId);
        if (!payment) {
            const dbPayment = db.getPaymentById(paymentId);
            if (!dbPayment) {
                return res.status(404).json({ error: 'Payment not found' });
            }

            // Get coin info
            const coin = db.getCoinById(dbPayment.coin_id);
            payment = {
                ...dbPayment,
                method: dbPayment.method,
                address: dbPayment.address,
                coin: coin,
                createdAt: dbPayment.created_at,
            };
        }

        // Parse rate if stored as string
        let rate = null;
        if (payment.rate) {
            try {
                rate = typeof payment.rate === 'string' ? JSON.parse(payment.rate) : payment.rate;
            } catch (e) {
                console.error('Error parsing rate:', e);
            }
        }

        res.json({
            paymentId: payment.paymentId || payment.payment_id,
            companyName: 'OMARA Pay', // Can be fetched from company data
            cashierName: 'Cashier', // Can be fetched from cashier data
            date: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            time: payment.createdAt ? new Date(payment.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
            amount: payment.usdAmount || payment.amount,
            cryptoAmount: payment.amount,
            method: payment.coin?.name || payment.method,
            symbol: payment.coin?.symbol || '',
            address: payment.address,
            phoneNumber: payment.phoneNumber,
            securityCode: payment.securityCode,
            txHash: payment.txHash || payment.tx_hash,
            status: payment.status,
            qrData: generateQRData(payment.method, payment.address, payment.amount),
        });
    } catch (error) {
        console.error('Error fetching receipt data:', error);
        res.status(500).json({ error: 'Failed to fetch receipt data' });
    }
});

// Admin API routes (user CRUD must be registered before legacy admin router)
app.use('/api/admin', adminUsersRoutes);
app.use('/api/admin', adminRoutes);

// User auth API routes
app.use('/api/auth', authRoutes);

// POS API routes
const posRoutes = require('./routes/pos');
app.use('/api/pos', posRoutes);

// Admin pages
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin', requireAuthHTML, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

app.get('/admin/coins', requireAuthHTML, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'coins.html'));
});

app.get('/admin/payments', requireAuthHTML, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'payments.html'));
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server - bind to 0.0.0.0 to allow connections from emulator and network devices
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Crypto POS Server running on port ${PORT}`);
    console.log(`📱 Access the POS at http://localhost:${PORT}`);
    console.log(`📱 Access from Android emulator: http://10.0.2.2:${PORT}`);
    console.log(`🔐 Access the Admin Panel at http://localhost:${PORT}/admin`);
    console.log(`⚠️  Default admin credentials: admin / admin123`);
    console.log(`⚠️  PLEASE CHANGE THE DEFAULT PASSWORD IMMEDIATELY!`);

    // Validate configuration
    const enabledCoins = db.getEnabledCoins();
    console.log(`✅ ${enabledCoins.length} coin(s) enabled and ready`);
});

// Cleanup interval (every 10 minutes)
setInterval(cleanupOldPayments, 10 * 60 * 1000);

