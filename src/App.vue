<template>
  <div id="rainbowkit-modal" />
  <RainbowKitProvider :authentication-status="'unauthenticated'">
    <v-app>
      <div class="d-flex justify-end pa-4">
        <ConnectButton />
      </div>
      <router-view />
    </v-app>
  </RainbowKitProvider>
</template>

<script lang="ts" setup>
  import { useAccount } from '@wagmi/vue'
  import { ConnectButton, RainbowKitProvider } from 'use-rainbowkit-vue'
  import { watch } from 'vue'
  import { useWalletStore } from '@/stores/wallet'
  const { address } = useAccount()
  const walletStore = useWalletStore()

  watch(address, val => {
    walletStore.setAddress(val)
  }, { immediate: true })
</script>
