import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { RainbowKitVuePlugin, sepolia } from 'use-rainbowkit-vue'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { config } from './config'
import 'use-rainbowkit-vue/style.css'
import 'unfonts.css'

const app = createApp(App)

const queryClient = new QueryClient()

registerPlugins(app)

app
  .use(WagmiPlugin, { config })
  .use(RainbowKitVuePlugin, {
    appName: 'Lottery',
    projectId: import.meta.env.VITE_WC_PROJECT_ID ?? 'YOUR_PROJECT_ID',
    chains: [sepolia],
  })
  .use(VueQueryPlugin, { queryClient })
  .mount('#app')
