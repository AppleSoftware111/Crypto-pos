/**
 * Payment Methods Configuration
 * Defines all available payment methods with their properties
 */

export const PAYMENT_METHOD_TYPES = {
  CRYPTO: 'crypto',
  CARD: 'card',
  QR_WALLET: 'qr_wallet',
};

export const PAYMENT_METHODS = [
  // QR Wallets
  {
    id: 'qr-code',
    name: 'QR Code',
    type: PAYMENT_METHOD_TYPES.QR_WALLET,
    icon: '📱',
    methodCode: 'qr-code',
    enabled: true,
  },
  {
    id: 'gcash',
    name: 'Gcash',
    type: PAYMENT_METHOD_TYPES.QR_WALLET,
    icon: '💚',
    methodCode: 'gcash',
    enabled: true,
  },
  {
    id: 'wechat-pay',
    name: 'WeChat Pay',
    type: PAYMENT_METHOD_TYPES.QR_WALLET,
    icon: '💬',
    methodCode: 'wechat-pay',
    enabled: true,
  },
  {
    id: 'alipay',
    name: 'Alipay',
    type: PAYMENT_METHOD_TYPES.QR_WALLET,
    icon: '💙',
    methodCode: 'alipay',
    enabled: true,
  },
  
  // Credit Cards
  {
    id: 'visa',
    name: 'Visa',
    type: PAYMENT_METHOD_TYPES.CARD,
    icon: '💳',
    methodCode: 'visa',
    enabled: true,
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    type: PAYMENT_METHOD_TYPES.CARD,
    icon: '💳',
    methodCode: 'mastercard',
    enabled: true,
  },
  {
    id: 'unionpay',
    name: 'UnionPay',
    type: PAYMENT_METHOD_TYPES.CARD,
    icon: '💳',
    methodCode: 'unionpay',
    enabled: true,
  },
  
  // Cryptocurrencies
  {
    id: 'btc',
    name: 'Bitcoin',
    type: PAYMENT_METHOD_TYPES.CRYPTO,
    icon: '₿',
    methodCode: 'btc',
    symbol: 'BTC',
    enabled: true,
  },
  {
    id: 'eth',
    name: 'Ethereum',
    type: PAYMENT_METHOD_TYPES.CRYPTO,
    icon: 'Ξ',
    methodCode: 'eth',
    symbol: 'ETH',
    enabled: true,
  },
  {
    id: 'link',
    name: 'Chainlink',
    type: PAYMENT_METHOD_TYPES.CRYPTO,
    icon: '🔗',
    methodCode: 'link',
    symbol: 'LINK',
    enabled: true,
  },
  {
    id: 'dot',
    name: 'Polkadot',
    type: PAYMENT_METHOD_TYPES.CRYPTO,
    icon: '⚫',
    methodCode: 'dot',
    symbol: 'DOT',
    enabled: true,
  },
  {
    id: 'bnb',
    name: 'Binance BEP20',
    type: PAYMENT_METHOD_TYPES.CRYPTO,
    icon: '🟡',
    methodCode: 'bnb',
    symbol: 'BNB',
    enabled: true,
  },
  {
    id: 'trx',
    name: 'Tron',
    type: PAYMENT_METHOD_TYPES.CRYPTO,
    icon: '🔴',
    methodCode: 'trx',
    symbol: 'TRX',
    enabled: true,
  },
  
  // Digital Wallets
  {
    id: 'gpay',
    name: 'Google Pay',
    type: PAYMENT_METHOD_TYPES.QR_WALLET,
    icon: '📱',
    methodCode: 'gpay',
    enabled: true,
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    type: PAYMENT_METHOD_TYPES.QR_WALLET,
    icon: '🍎',
    methodCode: 'apple-pay',
    enabled: true,
  },
];

/**
 * Get payment method by ID
 */
export const getPaymentMethodById = (id) => {
  return PAYMENT_METHODS.find(method => method.id === id);
};

/**
 * Get payment method by method code
 */
export const getPaymentMethodByCode = (code) => {
  return PAYMENT_METHODS.find(method => method.methodCode === code);
};

/**
 * Get enabled payment methods
 */
export const getEnabledPaymentMethods = () => {
  return PAYMENT_METHODS.filter(method => method.enabled);
};

/**
 * Get payment methods by type
 */
export const getPaymentMethodsByType = (type) => {
  return PAYMENT_METHODS.filter(method => method.type === type && method.enabled);
};

/**
 * Merge server coins with static payment methods
 * Server coins take precedence if they exist.
 * When server coins are available, only those crypto methods are shown.
 */
export const mergePaymentMethods = (serverCoins = []) => {
  const hasServerCoins = Array.isArray(serverCoins) && serverCoins.length > 0;

  // Keep non-crypto static methods (cards / wallets).
  const staticNonCrypto = PAYMENT_METHODS.filter(
    method => method.type !== PAYMENT_METHOD_TYPES.CRYPTO
  );

  // If no server data yet, keep existing behavior as fallback.
  if (!hasServerCoins) {
    return PAYMENT_METHODS.filter(m => m.enabled);
  }

  // Normalize server coin shape (supports plain JSON and Coin model instances).
  const normalizedServerCrypto = serverCoins
    .map((coin) => {
      const methodCode = coin.method_code || coin.methodCode || coin.id;
      const enabled = coin.enabled === 1 || coin.enabled === true;
      return {
        id: coin.id || methodCode,
        name: coin.name || methodCode,
        type: PAYMENT_METHOD_TYPES.CRYPTO,
        icon: coin.icon || coin.symbol?.charAt(0) || '💎',
        methodCode,
        symbol: coin.symbol || methodCode,
        enabled,
        ...coin,
      };
    })
    .filter((coin) => coin.enabled && coin.methodCode);

  // Merge with static metadata if a crypto methodCode exists there.
  const mergedServerCrypto = normalizedServerCrypto.map((coin) => {
    const staticMatch = PAYMENT_METHODS.find(
      method => method.type === PAYMENT_METHOD_TYPES.CRYPTO &&
        method.methodCode === coin.methodCode
    );

    return staticMatch ? { ...staticMatch, ...coin } : coin;
  });

  return [...staticNonCrypto.filter(m => m.enabled), ...mergedServerCrypto];
};
