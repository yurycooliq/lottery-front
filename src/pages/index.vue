<template>
  <div v-if="!wallet.isAuthorized" class="home__center">
    Подключите свой кошелек в сети Sepolia
  </div>
  <v-card v-else class="mx-auto my-4" max-width="400">
    <v-card-title>Lottery</v-card-title>
    <v-card-text>
      <v-list density="compact">
        <template v-if="playersDisplay.length > 0">
          <v-list-item v-for="(addr, i) in playersDisplay" :key="i">
            <v-list-item-title>{{ addr }}</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item>
            <v-list-item-title>No participants</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn color="secondary" :loading="mintPending" @click="mint">Mint 100 USDT</v-btn>
      <v-spacer />
      <template v-if="playersDisplay.length < 5">
        <v-btn color="primary" :disabled="!canBuy || buyPending" :loading="buyPending" @click="buy">Buy ticket</v-btn>
      </template>
      <template v-else>
        <v-btn color="primary" :disabled="!isOwner || drawPending" :loading="drawPending" @click="draw">Draw winner</v-btn>
      </template>
    </v-card-actions>
  </v-card>
  <v-snackbar v-model="snackbar" :color="snackbarColor" location="top" timeout="4000">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useLotteryStore } from '@/stores/lottery'
  import { useTokenStore } from '@/stores/token'
  import { useWalletStore } from '@/stores/wallet'

  const walletStore = useWalletStore()
  const wallet = storeToRefs(walletStore)

  const tokenStore = useTokenStore()
  const { balance } = storeToRefs(tokenStore)

  const lotteryStore = useLotteryStore()

  onMounted(() => {
    lotteryStore.fetchPlayers()
    lotteryStore.fetchOwner()
  })
  const { players, lastWinner, lastTicketBuyer, isOwner, drawLoading } = storeToRefs(lotteryStore)

  // snackbar when new ticket bought
  watch(lastTicketBuyer, buyer => {
    if (!buyer) return
    const label = buyer.toLowerCase() === (wallet.address.value ?? '').toLowerCase() ? 'You' : buyer
    snackbarText.value = `Ticket bought: ${label}`
    snackbarColor.value = 'success'
    snackbar.value = true
  })
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const playersDisplay = computed(() =>
    players.value
      .filter((a): a is string => typeof a === 'string' && a.toLowerCase() !== ZERO_ADDRESS)
      .map(a =>
        a.toLowerCase() === (wallet.address.value ?? '').toLowerCase() ? 'You' : a,
      ),
  )

  const ticketPrice = BigInt(import.meta.env.VITE_LOTTERY_TICKET_PRICE)
  const canBuy = computed(() => (balance.value ?? 0n) >= ticketPrice)

  const snackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref<'success' | 'error'>('success')

  const { mintLoading } = storeToRefs(tokenStore)
  const { buyLoading } = storeToRefs(lotteryStore)

  const mintPending = mintLoading
  const buyPending = buyLoading
  const drawPending = drawLoading

  const LOTTERY_ADDRESS = import.meta.env.VITE_LOTTERY_CONTRACT_ADDRESS as `0x${string}`

  const buy = async () => {
    try {
      // ensure sufficient allowance via token store action
      if (wallet.address.value) {
        await tokenStore.ensureAllowance(wallet.address.value as `0x${string}`, LOTTERY_ADDRESS, ticketPrice)
      }

      // Purchase ticket
      await lotteryStore.buyTicket()
      snackbarText.value = 'Ticket purchased successfully!'
      snackbarColor.value = 'success'
      snackbar.value = true
    } catch (error) {
      console.error(error as Error)
      snackbarText.value = 'Buy failed: ' + (error as Error).message
      snackbarColor.value = 'error'
      snackbar.value = true
    }
  }

  const draw = async () => {
    try {
      await lotteryStore.drawWinner()
      snackbarText.value = 'Waiting for random number from Chainlink'
      snackbarColor.value = 'success'
      snackbar.value = true
    } catch (error) {
      console.error(error as Error)
      snackbarText.value = 'Draw failed: ' + (error as Error).message
      snackbarColor.value = 'error'
      snackbar.value = true
    }
  }

  const mint = async () => {
    try {
      await tokenStore.mintUSDT()
      snackbarText.value = 'Mint successful!'
      snackbarColor.value = 'success'
      snackbar.value = true
    } catch (error) {
      console.error(error as Error)
      snackbarText.value = 'Mint failed: ' + (error as Error).message
      snackbarColor.value = 'error'
      snackbar.value = true
    }
  }
</script>

<style scoped lang="scss">
.home {
  &__center {
    text-align: center;
  }
}
</style>
