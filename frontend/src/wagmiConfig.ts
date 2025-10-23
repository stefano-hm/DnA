import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'DnA dApp',
  projectId: '95e1fbd3d0e0bcb2144e98eb53468c77', 
  chains: [sepolia],
  ssr: false,
});
