import { defineStore } from 'pinia';

// stores/modalStore.ts
export const useModalStore = defineStore('modal', {
  state: () => ({
    activeModal: null as 'vehicle' | 'driver' | null,
    data: null as unknown | null // Para passar um objeto se for edição
  }),
  actions: {
    openModal(type: 'vehicle' | 'driver', payload: unknown = null) {
      this.activeModal = type;
      this.data = payload;
    },
    closeModal() {
      this.activeModal = null;
      this.data = null;
    }
  }
})
