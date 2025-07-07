import { createConfig, fallback, http, webSocket } from '@wagmi/vue'
import { sepolia } from '@wagmi/vue/chains'

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: fallback([
      webSocket(import.meta.env.VITE_SEPOLIA_WS_URL as string),
      http(import.meta.env.VITE_SEPOLIA_RPC_URL as string),
    ]),
  },
})
