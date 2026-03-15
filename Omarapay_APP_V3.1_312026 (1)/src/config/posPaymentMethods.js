/**
 * POS card payment methods (same as mobile app).
 * Backend supports: visa, mastercard, unionpay.
 */
export const CARD_METHODS = [
  { id: 'visa', name: 'Visa', methodCode: 'visa', type: 'card', symbol: 'Visa', enabled: true, iconUrl: 'https://cdn.simpleicons.org/visa/1A1F71' },
  { id: 'mastercard', name: 'Mastercard', methodCode: 'mastercard', type: 'card', symbol: 'MC', enabled: true, iconUrl: 'https://cdn.simpleicons.org/mastercard/EB001B' },
  { id: 'unionpay', name: 'UnionPay', methodCode: 'unionpay', type: 'card', symbol: 'UnionPay', enabled: true, iconUrl: '/unionpay.svg' },
];

export const isCardMethod = (method) => method?.type === 'card';
