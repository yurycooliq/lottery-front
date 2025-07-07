// Utilities
import { defineStore } from 'pinia'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    address: undefined as string | undefined,
  }),
  getters: {
    isAuthorized: state => !!state.address,
  },
  actions: {
    setAddress (addr?: string) {
      this.address = addr
    },
  },
})
