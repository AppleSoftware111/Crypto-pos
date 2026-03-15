import { mainnet, polygon, bsc, arbitrum, optimism, base } from 'viem/chains';

export const tokenConfig = {
  [mainnet.id]: [
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6, name: 'Tether USD' },
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', decimals: 18, name: 'Dai Stablecoin' },
  ],
  [polygon.id]: [
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', decimals: 6, name: 'Tether USD' },
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', decimals: 6, name: 'USD Coin (PoS)' },
  ],
  [bsc.id]: [
    { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', decimals: 18, name: 'Tether USD' },
    { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC', decimals: 18, name: 'Binance-Peg USD Coin' },
  ],
  [arbitrum.id]: [
    { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', symbol: 'USDT', decimals: 6, name: 'Tether USD' },
    { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', symbol: 'USDC', decimals: 6, name: 'USD Coin (Arb1)' },
  ],
  [optimism.id]: [
    { address: '0x94b008aA00579c1307B0EF2c499aD98a8ce9870B', symbol: 'USDT', decimals: 6, name: 'Tether USD' },
    { address: '0x7F5c764cNc1C51320275C95395b62bE618535334', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
  ],
  [base.id]: [
    { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
    { address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', symbol: 'USDbC', decimals: 6, name: 'USD Base Coin' },
  ]
};