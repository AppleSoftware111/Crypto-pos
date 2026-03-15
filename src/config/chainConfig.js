import { mainnet, polygon, bsc, arbitrum, optimism, base } from 'viem/chains';
import { Layers, Box, Hexagon, Globe, Zap, Cpu } from 'lucide-react';

export const chainConfig = {
  [mainnet.id]: {
    id: mainnet.id,
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    icon: Layers,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  [polygon.id]: {
    id: polygon.id,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    icon: Box,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  [bsc.id]: {
    id: bsc.id,
    name: 'BNB Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    icon: Hexagon,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }
  },
  [arbitrum.id]: {
    id: arbitrum.id,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    icon: Globe,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  [optimism.id]: {
    id: optimism.id,
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    icon: Zap,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  [base.id]: {
    id: base.id,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    icon: Cpu,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  }
};

export const supportedChains = [mainnet, polygon, bsc, arbitrum, optimism, base];