import { http, createConfig } from 'wagmi';
import {
  avalanche,
  avalancheFuji,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
} from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  safeWallet,
  coreWallet,
  tokenPocketWallet,
} from '@rainbow-me/rainbowkit/wallets';

/** Reown (WalletConnect Cloud). Add your Vercel origin at https://cloud.reown.com for this project. */
const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'a80c99f8d4de8e4268e0a133f009f001';

// Detect if user is on mobile device
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Configure wallet connectors based on device type
const getWalletConnectors = () => {
  const mobileWallets = [
    coreWallet,
    tokenPocketWallet,
    trustWallet,
    metaMaskWallet,
    walletConnectWallet,
  ];

  const desktopWallets = [
    metaMaskWallet,
    coreWallet,
    trustWallet,
    walletConnectWallet,
    coinbaseWallet,
    rainbowWallet,
    safeWallet,
    tokenPocketWallet,
  ];

  return isMobile() ? mobileWallets : desktopWallets;
};

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: getWalletConnectors(),
    },
  ],
  {
    appName: 'Omarapay_wallet',
    projectId: projectId,
  }
);

/**
 * Explicit RPC URLs for browser fetch (viem `http()` with no URL can fall back to providers
 * that do not send CORS headers — breaking SPAs on Vercel). Override with VITE_RPC_* in .env.
 */
function pickRpc(envName, fallback) {
  const v = import.meta.env[envName];
  if (typeof v === 'string' && v.trim()) return v.trim();
  return fallback;
}

export const config = createConfig({
  connectors,
  chains: [
    avalanche,
    avalancheFuji,
    mainnet,
    polygon,
    arbitrum,
    optimism,
    base,
  ],
  ssr: false,
  transports: {
    [avalanche.id]: http(pickRpc('VITE_RPC_AVALANCHE', 'https://api.avax.network/ext/bc/C/rpc')),
    [avalancheFuji.id]: http(pickRpc('VITE_RPC_AVALANCHE_FUJI', 'https://api.avax-test.network/ext/bc/C/rpc')),
    [mainnet.id]: http(pickRpc('VITE_RPC_MAINNET', 'https://cloudflare-eth.com')),
    [polygon.id]: http(pickRpc('VITE_RPC_POLYGON', 'https://polygon-rpc.com')),
    [arbitrum.id]: http(pickRpc('VITE_RPC_ARBITRUM', 'https://arb1.arbitrum.io/rpc')),
    [optimism.id]: http(pickRpc('VITE_RPC_OPTIMISM', 'https://mainnet.optimism.io')),
    [base.id]: http(pickRpc('VITE_RPC_BASE', 'https://mainnet.base.org')),
  },
});