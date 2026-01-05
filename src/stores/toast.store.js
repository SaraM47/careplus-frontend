import { defineStore } from 'pinia'

// Global toast store for transient feedback messages
export const useToastStore = defineStore('toast', {
  state: () => ({
    visible: false,
    message: '',
    type: 'success', // 'success' | 'error'
    timeoutId: null,
  }),

  actions: {
    // Show toast for a limited duration
    show(message, type = 'success', duration = 3000) {
      this.message = message
      this.type = type
      this.visible = true

      // Clear existing timer to avoid flicker
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }

      this.timeoutId = setTimeout(() => {
        this.visible = false
      }, duration)
    },

    // Convenience helpers
    success(message) {
      this.show(message, 'success')
    },

    error(message) {
      this.show(message, 'error')
    },

    // Manual hide when needed
    hide() {
      this.visible = false
    },
  },
})
