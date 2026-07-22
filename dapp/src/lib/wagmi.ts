import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'csBetz',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [baseSepolia, base], // Sepolia en premier pour dev, tu switch l'ordre en prod
  ssr: false, // pas de SSR ici, on est en Vite/CSR pur
})