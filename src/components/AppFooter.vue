<template>
  <v-footer
    app
    height="40"
  >
    <div class="d-flex align-center justify-space-between w-100 px-4">
      <template v-if="wallet.isAuthorized">
        <span>{{ wallet.address }}</span>
        <v-spacer />
        <span v-if="wallet.isAuthorized">{{ parsedBalance }} USDT</span>
      </template>
      <template v-else>
        Подключите свой кошелек в сети Sepolia
      </template>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { onUnmounted, watch } from 'vue'
  import { useTokenStore } from '@/stores/token'
  import { useWalletStore } from '@/stores/wallet'

  const walletStore = useWalletStore()
  const wallet = storeToRefs(walletStore)

  const tokenStore = useTokenStore()
  const { parsedBalance } = storeToRefs(tokenStore)

  let timer: ReturnType<typeof setInterval> | undefined

  function fetchBalance () {
    tokenStore.updateBalance(wallet.address.value)
  }

  watch(
    () => wallet.address.value,
    addr => {
      if (addr) {
        fetchBalance()
        timer = setInterval(fetchBalance, 3000)
      } else if (timer) {
        clearInterval(timer)
        timer = undefined
        tokenStore.updateBalance(undefined)
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })
</script>

<style scoped lang="sass"></style>
