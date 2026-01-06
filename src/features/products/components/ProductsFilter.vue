<template>
  <!-- Filter panel with local draft state -->
  <div class="bg-white rounded-xl shadow-soft px-4 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
    <!-- Category -->
    <div>
      <label for="filter-category" class="block text-md mb-1"> Category </label>
      <select id="filter-category" v-model="draft.categoryId" class="input">
        <option value="">All categories</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </div>

    <!-- Stock -->
    <div>
      <label for="filter-stock" class="block text-md mb-1"> Stock </label>
      <select id="filter-stock" v-model="draft.inStock" class="input">
        <option value="">All</option>
        <option value="true">In stock</option>
        <option value="false">Out of stock</option>
      </select>
    </div>

    <!-- Price min -->
    <div>
      <label for="filter-price-min" class="block text-md mb-1"> Price min </label>
      <input
        id="filter-price-min"
        v-model.number="draft.priceMin"
        type="number"
        min="0"
        class="input"
      />
    </div>

    <!-- Price max -->
    <div>
      <label for="filter-price-max" class="block text-md mb-1"> Price max </label>
      <input
        id="filter-price-max"
        v-model.number="draft.priceMax"
        type="number"
        min="0"
        class="input"
      />
    </div>

    <!-- Sort -->
    <div>
      <label for="filter-sort" class="block text-md mb-1"> Sort </label>
      <select id="filter-sort" v-model="draft.sort" class="input">
        <option value="createdAt_desc">Newest</option>
        <option value="createdAt_asc">Oldest</option>

        <option value="name_asc">Name A–Z</option>
        <option value="name_desc">Name Z–A</option>

        <option value="price_asc">Price low to high</option>
        <option value="price_desc">Price high to low</option>

        <option value="stock_asc">Stock low to high</option>
        <option value="stock_desc">Stock high to low</option>
      </select>
    </div>

    <!-- Actions -->
    <div class="md:col-span-4 flex gap-3 pt-2">
      <BaseButton @click="apply"> Apply filters </BaseButton>

      <button type="button" class="px-4 py-2 border rounded-full text-sm" @click="reset">
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// Props with categories for the category filter
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
})
// Emit event when filters are applied to parent
const emit = defineEmits(['applied'])

// Local draft state before sending filters to parent
const draft = ref({
  categoryId: '',
  inStock: '',
  priceMin: '',
  priceMax: '',
  sort: 'createdAt_desc',
})

// Apply filters by emitting 'applied' event with current draft values
function apply() {
  emit('applied', {
    categoryId: draft.value.categoryId || undefined,
    inStock: draft.value.inStock || undefined,
    minPrice: draft.value.priceMin !== '' ? Number(draft.value.priceMin) : undefined,
    maxPrice: draft.value.priceMax !== '' ? Number(draft.value.priceMax) : undefined,
    sort: draft.value.sort,
    page: 1,
  })
}

// Reset draft state for filters and re-apply
function reset() {
  draft.value = {
    categoryId: '',
    inStock: '',
    priceMin: '',
    priceMax: '',
    sort: 'createdAt_desc',
  }

  apply()
}
</script>

<style scoped>
/* Shared input style for selects and inputs */
.input {
  width: 100%;
  height: 42px;
  padding: 0 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
}

/* Focus */
.input:focus {
  outline: none;
  box-shadow: 0 0 0 2px black;
}

/* Normalice number inputs and remove number input spinners in in webkit browsers */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* input[type="number"] {
    -moz-appearance: textfield;
  } */
</style>
