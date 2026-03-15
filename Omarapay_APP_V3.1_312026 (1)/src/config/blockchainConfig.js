import { Layers, Box, Hexagon, Globe, Zap, Cpu, Mountain, Gauge } from 'lucide-react';
import { decimalToHex } from '@/lib/chainIdConverter';

export const blockchainConfig = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    chainName: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    currency: 'ETH',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    explorer: 'https://etherscan.io',
    blockExplorerUrls: ['https://etherscan.io'],
    color: 'bg-blue-100 dark:bg-blue-900',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-300',
    icon: Layers
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Chain',
    chainName: 'BNB Smart Chain Mainnet',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    currency: 'BNB',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    explorer: 'https://bscscan.com',
    blockExplorerUrls: ['https://bscscan.com'],
    color: 'bg-yellow-100 dark:bg-yellow-900',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-600 dark:text-yellow-300',
    icon: Hexagon
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    chainName: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    currency: 'MATIC',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    explorer: 'https://polygonscan.com',
    blockExplorerUrls: ['https://polygonscan.com'],
    color: 'bg-purple-100 dark:bg-purple-900',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-300',
    icon: Box
  },
  avalanche: {
    id: 'avalanche',
    name: 'Avalanche C-Chain',
    chainName: 'Avalanche C-Chain',
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    currency: 'AVAX',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    explorer: 'https://snowtrace.io',
    blockExplorerUrls: ['https://snowtrace.io'],
    color: 'bg-red-600 dark:bg-red-900',
    borderColor: 'border-red-500 dark:border-red-800',
    textColor: 'text-white dark:text-red-100',
    iconColorUnselected: 'text-red-600 dark:text-red-400',
    icon: Mountain
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chainName: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    currency: 'ETH',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    explorer: 'https://arbiscan.io',
    blockExplorerUrls: ['https://arbiscan.io'],
    color: 'bg-cyan-100 dark:bg-cyan-900',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    textColor: 'text-cyan-600 dark:text-cyan-300',
    icon: Globe
  },
  optimism: {
    id: 'optimism',
    name: 'Optimism',
    chainName: 'OP Mainnet',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    currency: 'ETH',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    explorer: 'https://optimistic.etherscan.io',
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    color: 'bg-red-50 dark:bg-red-950',
    borderColor: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-500 dark:text-red-400',
    icon: Zap
  },
  base: {
    id: 'base',
    name: 'Base',
    chainName: 'Base Mainnet',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    currency: 'ETH',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    explorer: 'https://basescan.org',
    blockExplorerUrls: ['https://basescan.org'],
    color: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-500 dark:text-blue-400',
    icon: Cpu
  },
  fantom: {
    id: 'fantom',
    name: 'Fantom Opera',
    chainName: 'Fantom Opera',
    chainId: 250,
    rpcUrl: 'https://rpc.ftm.tools',
    currency: 'FTM',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    explorer: 'https://ftmscan.com',
    blockExplorerUrls: ['https://ftmscan.com'],
    color: 'bg-indigo-50 dark:bg-indigo-950',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    icon: Gauge
  }
};

export const getBlockchainByChainId = (chainId) => {
  return Object.values(blockchainConfig).find(chain => chain.chainId === chainId);
};

export const formatChainName = (chainId) => {
  const chain = getBlockchainByChainId(chainId);
  return chain ? chain.name : 'Unknown Network';
};

export const getChainAddParams = (chainIdDecimal) => {
  const chain = getBlockchainByChainId(chainIdDecimal);
  if (!chain) return null;

  return {
    chainId: decimalToHex(chain.chainId),
    chainName: chain.chainName,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: [chain.rpcUrl], // Use array as required by RPC standard
    blockExplorerUrls: chain.blockExplorerUrls
  };
};