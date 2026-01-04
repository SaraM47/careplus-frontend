<template>
    <!-- Acts as RouterLink when `to` is provided, otherwise as a button -->
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    type="button"
    @click="onClick"
    :class="buttonClass"
  >
    <!-- Icon -->
    <span
      v-if="icon"
      :class="iconClass"
    >
      <i :class="icon"></i>
    </span>

    <!-- Label -->
    <span :class="labelClass">
      <slot />
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

/* Props controlling behavior and appearance */
const props = defineProps({
  to: String,
  onClick: Function,
  icon: String,
  mobile: Boolean,
})

const route = useRoute()

/*  Active state */
const isActive = computed(() => {
  if (!props.to) return false
  return route.path.startsWith(props.to)
})

/* Button classes with desktop and mobile variants with active and hover states */
const buttonClass = computed(() => {
  if (props.mobile) {
    return [
      'flex flex-col items-center justify-center h-full w-full transition-colors',
      isActive.value
        ? 'bg-[#94DDDF] text-black'
        : 'text-gray-600',
    ]
  }

  return [
    'group flex items-center gap-3 px-5 py-2 rounded-full transition-colors',
    isActive.value
      ? 'bg-[#94DDDF] text-black'
      : 'bg-(--color-surface) text-(--color-text-dark) hover:bg-(--color-dark) hover:text-(--color-text-light)',
  ]
})

/* Icon styles which adjust size and background based on variant and active state */
const iconClass = computed(() => {
  if (props.mobile) {
    return 'text-2xl mb-1'
  }

  return [
    'flex items-center justify-center h-9 w-9 rounded-full transition-colors',
    isActive.value
      ? 'bg-[#94DDDF]'
      : 'bg-(--color-icon) group-hover:bg-[#103A40]',
  ]
})

/* Label styles */
const labelClass = computed(() => {
  return props.mobile
    ? 'text-xs font-medium'
    : 'text-base font-medium'
})
</script>
