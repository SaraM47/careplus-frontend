<template>
    <!-- Toast notification with fade transition -->
    <transition name="fade">
      <div
        v-if="toast.visible"
        class="
          fixed bottom-6 right-6 z-50
          px-6 py-4 rounded-xl shadow-card
          flex items-center gap-3
          text-white
        "
        :class="toastClass"
      >
        <!-- Icon changes based on toast type -->
        <i
          v-if="toast.type === 'success'"
          class="fa-solid fa-circle-check"
        ></i>
  
        <i
          v-else
          class="fa-solid fa-circle-xmark"
        ></i>
  
        <!-- Toast message -->
        <span class="font-medium">
          {{ toast.message }}
        </span>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useToastStore } from '@/stores/toast.store'
  
  // Access the toast store
  const toast = useToastStore()
  
  // Pick background color based on type
  const toastClass = computed(() =>
    toast.type === 'success'
      ? 'bg-green-600'
      : 'bg-red-600'
  )
  </script>
  
  <style scoped>
  /* Simple fade + slide transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }
  </style>
  