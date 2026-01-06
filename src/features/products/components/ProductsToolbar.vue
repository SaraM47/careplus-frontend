<template>
    <!-- Toolbar for search, filters, sorting, and pagination controls -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div class="md:col-span-2">
          <label class="text-xs text-gray-600">Sök</label>
          <input
            :value="query.q"
            @input="$emit('update', { q: $event.target.value, page: 1 })"
            class="w-full border rounded px-3 py-2"
            placeholder="Name, SKU..."
          />
        </div>
  
        <div>
          <label class="text-xs text-gray-600">Kategori</label>
          <select
            :value="query.categoryId"
            @change="$emit('update', { categoryId: $event.target.value, page: 1 })"
            class="w-full border rounded px-3 py-2"
          >
            <option value="">Alla</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>
  
        <div>
          <label class="text-xs text-gray-600">I lager</label>
          <select
            :value="query.inStock"
            @change="$emit('update', { inStock: $event.target.value, page: 1 })"
            class="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
  
        <div>
          <label class="text-xs text-gray-600">Price min</label>
          <input
            type="number"
            :value="query.priceMin"
            @input="$emit('update', { priceMin: $event.target.value, page: 1 })"
            class="w-full border rounded px-3 py-2"
            placeholder="0"
          />
        </div>
  
        <div>
          <label class="text-xs text-gray-600">Price max</label>
          <input
            type="number"
            :value="query.priceMax"
            @input="$emit('update', { priceMax: $event.target.value, page: 1 })"
            class="w-full border rounded px-3 py-2"
            placeholder="9999"
          />
        </div>
  
        <div class="md:col-span-2">
          <label class="text-xs text-gray-600">Sortering</label>
          <select
            :value="query.sort"
            @change="$emit('update', { sort: $event.target.value, page: 1 })"
            class="w-full border rounded px-3 py-2"
          >
            <option value="createdAt_desc">Newest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="price_asc">Price, low to high</option>
            <option value="price_desc">Pirce, hight to low</option>
            <option value="stock_asc">Stock balance, low to high</option>
            <option value="stock_desc">Stock balance, hight to low</option>
            <option value="name_asc">Name, A–Ö</option>
            <option value="name_desc">Name, Ö–A</option>
          </select>
        </div>
  
        <div class="md:col-span-2">
          <label class="text-xs text-gray-600">Per page</label>
          <select
            :value="query.pageSize"
            @change="$emit('update', { pageSize: Number($event.target.value), page: 1 })"
            class="w-full border rounded px-3 py-2"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
  
        <div class="md:col-span-2 flex items-end gap-2">
          <button
            type="button"
            class="px-3 py-2 rounded bg-gray-900 text-white text-sm"
            @click="$emit('reset')"
          >
            Reset
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded border border-gray-300 text-sm"
            @click="$emit('refresh')"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Props and emits for the toolbar
  defineProps({
    query: { type: Object, required: true },
    categories: { type: Array, default: () => [] },
  });
  
  // Emit events for updating filters, resetting, and refreshing
  defineEmits(["update", "reset", "refresh"]);
  </script>
  