<!-- Base button component with consistent styling -->
<template>
    <button
      :type="type"
      :disabled="disabled"
      class="
        inline-flex items-center gap-2
        px-6 py-2
        rounded-full
        bg-[#94DDDF]
        border-2 border-[#05B8C0]
        text-[#003132]
        font-medium
        transition-colors
        hover:bg-[#05B8C0]
        hover:text-white
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      <i v-if="icon" :class="icon" aria-hidden="true"></i>
      <slot />
    </button>
  </template>
  
  <script setup>
  // Props controlling button behavior and appearance
  defineProps({
    type: { type: String, default: "button" },
    disabled: { type: Boolean, default: false },
    icon: { type: String, default: "" },
  });
  </script>
  