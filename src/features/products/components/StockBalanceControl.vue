<template>
  <!-- Stock increment / decrement control -->
  <div class="flex items-center gap-2 border rounded-pill px-2 py-1">
    <button
      type="button"
      class="w-7 h-7 rounded-full border grid place-items-center hover:bg-gray-50"
    >
      <i class="fa-solid fa-minus"></i>
    </button>

    <!-- Current value -->
    <span class="min-w-5 text-center text-sm">
      {{ value }}
    </span>

    <!-- Increase -->
    <button
      type="button"
      class="w-7 h-7 rounded-full border grid place-items-center hover:bg-gray-50"
    >
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<script setup>
// Display-only stock value
defineProps({
  value: { type: Number, default: 0 },
})
</script>
