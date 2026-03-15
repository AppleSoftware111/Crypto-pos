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

const projectId = 'a80c99f8d4de8e4268e0a133f009f001';

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
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
});