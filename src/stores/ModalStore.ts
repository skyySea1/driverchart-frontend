// stores/modalStore.ts
import { defineStore } from 'pinia'

type ModalType = 'vehicle' | 'driver' | 'notification'

export const useModalStore = defineStore('modal', {
  state: () => ({
    activeModal: null as ModalType | null,
    data: null as unknown | null,
  }),
  actions: {
    openModal(type: ModalType, payload: unknown = null) {
      this.activeModal = type
      this.data = payload
    },
    closeModal() {
      this.activeModal = null
      this.data = null
    },
  },
})
