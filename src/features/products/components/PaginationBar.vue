<template>
    <!-- Pagination navigation -->
  <nav
    v-if="pageCount > 1"
    class="flex items-center gap-3"
    aria-label="Pagination"
  >
    <!-- Prev -->
    <button
      type="button"
      :disabled="page === 1"
      aria-label="Previous page"
      @click="$emit('go', page - 1)"
      class="px-6 py-2 rounded-full bg-(--color-light) border border-(--color-primary) text-(--color-dark) disabled:opacity-40 transition"
    >
      Prev
    </button>

    <!-- Page numbers -->
    <template v-for="p in pages" :key="p">
      <span
        v-if="p === '...'"
        class="px-1 text-gray-500"
        aria-hidden="true"
      >
        …
      </span>

      <button
        v-else
        type="button"
        :aria-label="`Go to page ${p}`"
        @click="$emit('go', p)"
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center transition',
          p === page
            ? 'bg-(--color-primary) text-black'
            : 'bg-(--color-surface) border border-black text-black hover:bg-gray-100',
        ]"
      >
        {{ p }}
      </button>
    </template>

    <!-- Next -->
    <button
      type="button"
      aria-label="Next page"
      :disabled="page === pageCount"
      @click="$emit('go', page + 1)"
      class="px-6 py-2 rounded-full bg-(--color-light) border border-(--color-primary) text-(--color-dark) disabled:opacity-40 transition"
    >
      Next
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

// Props for current page and total page count
const props = defineProps({
  page: { type: Number, required: true },
  pageCount: { type: Number, required: true },
})

// Emit event to navigate to a specific page
defineEmits(['go'])

// Computed pages array with ellipses for large page counts
const pages = computed(() => {
  const result = []
  const max = props.pageCount
  const current = props.page

  // Show all pages if total is 5 or less
  if (max <= 5) {
    for (let i = 1; i <= max; i++) result.push(i)
    return result
  }

  // Always show first page
  result.push(1)

  // Ellipsis if current page is beyond 3
  if (current > 3) result.push('...')

  // Pages around current page
  const start = Math.max(2, current - 1)
  const end = Math.min(max - 1, current + 1)

  // Add pages from start to end
  for (let i = start; i <= end; i++) {
    result.push(i)
  }

  // Ellipsis if current page is before max - 2
  if (current < max - 2) result.push('...')

  result.push(max)

  return result
})
</script>
