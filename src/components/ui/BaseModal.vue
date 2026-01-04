<template>
    <!-- Modal container centered on screen -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/40"
        @click="$emit('close')"
      ></div>
  
      <!-- Modal box -->
      <div
        class="
          relative bg-white
          rounded-xl shadow-card
          w-full max-w-2xl
          p-8
        "
      >
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  // Emit close event when overlay is clicked
  defineEmits(["close"]);
  </script>
  