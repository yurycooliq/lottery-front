import { readContract, waitForTransactionReceipt, watchContractEvent, writeContract } from '@wagmi/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import lotteryAbi from '@/abis/lottery.abi'
import { config } from '@/config'
import { useWalletStore } from '@/stores/wallet'

const LOTTERY_ADDRESS = import.meta.env.VITE_LOTTERY_CONTRACT_ADDRESS as `0x${string}`

export const useLotteryStore = defineStore('lottery', () => {
  const players = ref<string[]>([])
  const owner = ref<string | null>(null)
  const drawLoading = ref(false)
  const awaitingRandom = ref(false)
  const lastTicketBuyer = ref<string | null>(null)
  const lastWinner = ref<{ address: string, prize: bigint } | null>(null)

  const walletStore = useWalletStore()
  const { address } = storeToRefs(walletStore)

  const displayPlayers = computed(() => players.value.map(a => a.toLowerCase()))
  const isOwner = computed(() => (address.value ?? '').toLowerCase() === (owner.value ?? '').toLowerCase())

  const buyLoading = ref(false)

  async function buyTicket () {
    try {
      buyLoading.value = true
      const hash = await writeContract(config, {
        address: LOTTERY_ADDRESS,
        abi: lotteryAbi,
        functionName: 'buyTicket',
      })
      await waitForTransactionReceipt(config, { hash })
      buyLoading.value = false
    } catch (error) {
      console.error('buyTicket', error)
      buyLoading.value = false
      throw error
    }
  }

  async function fetchOwner () {
    try {
      const result = (await readContract(config, {
        address: LOTTERY_ADDRESS,
        abi: lotteryAbi,
        functionName: 'owner',
      })) as string
      owner.value = result
    } catch (error) {
      console.error('fetchOwner', error)
    }
  }

  async function drawWinner () {
    try {
      drawLoading.value = true
      const hash = await writeContract(config, {
        address: LOTTERY_ADDRESS,
        abi: lotteryAbi,
        functionName: 'drawWinner',
      })
      await waitForTransactionReceipt(config, { hash })
      drawLoading.value = false
      awaitingRandom.value = true
    } catch (error) {
      console.error('drawWinner', error)
      drawLoading.value = false
      throw error
    }
  }

  async function fetchPlayers () {
    try {
      const result = (await readContract(config, {
        address: LOTTERY_ADDRESS,
        abi: lotteryAbi,
        functionName: 'getPlayers',
      })) as string[]
      players.value = result
    } catch (error) {
      console.error('fetchPlayers', error)
    }
  }

  function setupEventListeners () {
    // TicketBought(address user,uint256 index)
    watchContractEvent(config, {
      address: LOTTERY_ADDRESS,
      abi: lotteryAbi,
      eventName: 'TicketBought',
      onLogs: logs => {
        for (const log of logs) {
          const { player } = log.args as { player: string, index: bigint }
          fetchPlayers()
          lastTicketBuyer.value = player
        }
      },
    })

    // WinnerPaid(address user,uint256 prizeAmount)
    watchContractEvent(config, {
      address: LOTTERY_ADDRESS,
      abi: lotteryAbi,
      eventName: 'WinnerPaid',
      onLogs: logs => {
        for (const log of logs) {
          const { winner, prize } = log.args as { winner: string, prize: bigint }
          lastWinner.value = { address: winner, prize }
          players.value = []
          awaitingRandom.value = false
        }
      },
    })
  }

  // call once in setup
  setupEventListeners()

  return { players, displayPlayers, lastWinner, lastTicketBuyer, owner, isOwner, drawLoading, awaitingRandom, fetchOwner, fetchPlayers, buyTicket, drawWinner, buyLoading }
})
