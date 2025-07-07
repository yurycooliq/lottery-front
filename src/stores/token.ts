import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import erc20Abi from '@/abis/erc20.abi'
import { config } from '@/config'

export const useTokenStore = defineStore('token', () => {
  const balance = ref<bigint>(0n)
  const USDT_ADDRESS = import.meta.env.VITE_USDT_CONTRACT_ADDRESS as `0x${string}`
  const MAX_UINT256 = (1n << 256n) - 1n
  const mintLoading = ref(false)

  const parsedBalance = computed(() => Number(balance.value) / 1_000_000)

  async function ensureAllowance (owner: `0x${string}`, spender: `0x${string}`, neededAmount: bigint) {
    try {
      const allowance = (await readContract(config, {
        address: USDT_ADDRESS,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [owner, spender],
      })) as bigint
      if (allowance < neededAmount) {
        const hash = await writeContract(config, {
          address: USDT_ADDRESS,
          abi: erc20Abi,
          functionName: 'approve',
          args: [spender, MAX_UINT256],
        })
        await waitForTransactionReceipt(config, { hash })
      }
    } catch (error) {
      console.error('ensureAllowance', error)
      throw error
    }
  }

  async function mintUSDT () {
    try {
      mintLoading.value = true
      const hash = await writeContract(config, {
        address: import.meta.env.VITE_USDT_CONTRACT_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'mint',
        args: [BigInt(100_000_000)],
      })
      await waitForTransactionReceipt(config, { hash })
      await updateBalance(undefined) // will set after outside call maybe
      mintLoading.value = false
    } catch (error) {
      console.error(error)
      mintLoading.value = false
      throw error
    }
  }

  async function updateBalance (address: string | undefined) {
    if (!address) {
      balance.value = 0n
      return
    }
    try {
      const result = (await readContract(config, {
        address: import.meta.env.VITE_USDT_CONTRACT_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      })) as bigint
      balance.value = result
    } catch (error) {
      console.error(error)
    }
  }

  return { balance, parsedBalance, updateBalance, mintUSDT, mintLoading, ensureAllowance }
})
