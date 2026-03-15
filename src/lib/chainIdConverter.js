/**
 * Utility functions for converting chain IDs between decimal and hex formats.
 * Essential for interacting with wallet RPC methods which require hex formats.
 */

export const decimalToHex = (chainId) => {
  if (!chainId) return null;
  // If already hex, return as is
  if (typeof chainId === 'string' && chainId.startsWith('0x')) return chainId;
  
  const num = Number(chainId);
  if (isNaN(num)) return null;
  
  return `0x${num.toString(16)}`;
};

export const hexToDecimal = (chainId) => {
  if (!chainId) return null;
  // If already number, return as is
  if (typeof chainId === 'number') return chainId;
  
  return parseInt(chainId, 16);
};

export const normalizeChainId = (chainId) => {
  return decimalToHex(chainId);
};