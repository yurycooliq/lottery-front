import { readContract, waitForTransactionReceipt, watchContractEvent, writeContract } from '@wagmi/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import lotteryAbi from '@/abis/lottery.abi'
import { config } from '@/config'

const LOTTERY_ADDRESS = import.meta.env.VITE_LOTTERY_CONTRACT_ADDRESS as `0x${string}`

export const useLotteryStore = defineStore('lottery', () => {
  const players = ref<string[]>([])
  const lastWinner = ref<{ address: string, prize: bigint } | null>(null)

  const displayPlayers = computed(() => players.value.map(a => a.toLowerCase()))

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

  async function fetchPlayers () {
    try {
      const result = (await readContract(config, {
        address: LOTTERY_ADDRESS,
        abi: lotteryAbi,
        functionName: 'getPlayers',
      })) as readonly string[]
      players.value = result.slice(0, 5)
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
          const { user, index } = log.args as { user: string, index: bigint }
          players.value[Number(index)] = user
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
          const { user, prizeAmount } = log.args as { user: string, prizeAmount: bigint }
          lastWinner.value = { address: user, prize: prizeAmount }
          players.value = []
        }
      },
    })
  }

  // call once in setup
  setupEventListeners()

  return { players, displayPlayers, lastWinner, fetchPlayers, buyTicket, buyLoading }
})
