<template>
    <!-- Responsive table wrapper -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-left">
              <th class="p-3 w-16">Bild</th>
              <th class="p-3">Namn</th>
              <th class="p-3">Kategori</th>
              <th class="p-3">Pris</th>
              <th class="p-3">Lager</th>
            </tr>
          </thead>
  
          <tbody>
            <!-- Rows -->
            <tr v-for="p in items" :key="p.id" class="border-b border-gray-100">
              <td class="p-3">
                <div class="h-10 w-10 rounded bg-gray-100 overflow-hidden">
                  <img
                    v-if="p.imagePath"
                    :src="p.imagePath"
                    alt=""
                    class="h-full w-full object-cover"
                  />
                </div>
              </td>
              <td class="p-3">
                <div class="font-medium">{{ p.name }}</div>
                <div v-if="p.sku" class="text-xs text-gray-500">{{ p.sku }}</div>
              </td>
              <td class="p-3">
                <span class="text-gray-700">{{ categoryName(p.categoryId) }}</span>
              </td>
              <td class="p-3">{{ formatPrice(p.price) }}</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs"
                  :class="p.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                >
                  {{ p.stock }}
                </span>
              </td>
            </tr>

            <!-- empty state -->
            <tr v-if="items.length === 0">
              <td colspan="5" class="p-6 text-center text-gray-500">
                Inga produkter matchar din sökning.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  // Props for items and categories
  const props = defineProps({
    items: { type: Array, default: () => [] },
    categories: { type: Array, default: () => [] },
  });
  
  // Helper to get category name by ID
  function categoryName(categoryId) {
    if (!categoryId) return "–";
    const c = props.categories.find((x) => x.id === categoryId);
    return c?.name ?? "–";
  }
  
  // Format SEK price for display
  function formatPrice(n) {
    if (n === null || n === undefined) return "–";
    return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(Number(n));
  }
  </script>
  